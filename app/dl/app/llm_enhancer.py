import os
import json
import time
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def enhance_diagnostic_data(vision_detection_string, db_data, lang="en"):
    if not vision_detection_string or "unknown" in vision_detection_string.lower():
        return {"error": "Please upload a clear image of leaf"}

    try:
        crop_name, disease_name = vision_detection_string.split("__")
        disease_name = disease_name.replace("_", " ")
    except ValueError:
        return {"error": "Please upload a clear image of leaf"}

    # Determine Target Language
    target_lang = "Hindi" if lang == "ह" or "hi" in str(lang).lower() else "English"
    is_translating = target_lang != "English"

    def is_empty(val):
        if not val:
            return True
        v_lower = str(val).lower().strip()
        return v_lower in ["n/a", "not found in database.", "null", "none", ""]

    # If translating, we MUST force the LLM to rewrite all fields in the target language
    needs_scientific_name = (
        is_empty(db_data.get("plant", {}).get("scientificName")) or is_translating
    )
    needs_description = (
        is_empty(db_data.get("plant", {}).get("description")) or is_translating
    )
    needs_symptoms = (
        is_empty(db_data.get("disease", {}).get("symptoms")) or is_translating
    )
    needs_trigger = (
        is_empty(db_data.get("disease", {}).get("trigger")) or is_translating
    )

    existing_organic = db_data.get("disease", {}).get("organic", "")
    existing_chemical = db_data.get("disease", {}).get("chemical", "")

    # Construct the Prompt
    prompt = f"""
    You are an expert agricultural plant pathologist. I have an image prediction for:
    Crop: {crop_name}
    Disease: {disease_name}

    CRITICAL INSTRUCTION: You MUST generate your ENTIRE response in {target_lang}. All text, descriptions, step-by-step guides, and field values must be translated to and written in {target_lang}.

    I need you to fill in database fields. Return ONLY a valid JSON object. Do not include markdown formatting like ```json.
    """

    if is_translating:
        prompt += f"\n- 'detection_string': Provide the format '[Crop Name in {target_lang}]__[Disease Name in {target_lang}]'. You MUST use the double underscores to separate them."

    if needs_scientific_name:
        prompt += f"\n- 'scientificName': The scientific name of the crop (Can remain in Latin if standard, but written in {target_lang} script if applicable)."
    if needs_description:
        prompt += f"\n- 'description': A brief 2-sentence description of the crop in {target_lang}."
    if needs_symptoms:
        prompt += f"\n- 'symptoms': Common visual symptoms of this disease on this crop in {target_lang}."
    if needs_trigger:
        prompt += f"\n- 'trigger': Environmental factors or causes that trigger this disease in {target_lang}."

    prompt += f"""
    You MUST ALSO generate comprehensive treatment plans for 'organic' and 'chemical' controls in {target_lang}. 
    Format both control strings using safe HTML tags for styling. Use <b> for bold headings, <br> for spacing, and <ul><li> for the step-by-step bulleted lists.
    
    CRITICAL REQUIREMENT for "How to use": You must provide highly detailed, in-depth, granular step-by-step instructions. Provide 6 to 10 distinct bullet points.

    Format it exactly like this template (but translated to {target_lang}):
    <b>What to use:</b> [Identify the specific substance/method]<br><br>
    <b>Why to use:</b> [Deep explanation of how it kills the pathogen or helps the crop]<br><br>
    <b>How to use:</b>
    <ul style="list-style-type: disc; padding-left: 20px; margin-top: 5px; line-height: 1.6;">
        <li>[Detailed Step 1: Preparation & Equipment]</li>
        <li>[Detailed Step 2: Mixing ratios & Dosages]</li>
        <li>[Detailed Step 3: Best time of day/weather to apply]</li>
        <li>[Detailed Step 4: Step-by-step application technique]</li>
        <li>[Detailed Step 5: Safety gear and precautions]</li>
        <li>[Detailed Step 6: Repetition schedule]</li>
        <li>[Detailed Step n...]</li>
    </ul>
    """

    if not is_translating:
        prompt += f"\nBase the 'organic' response on this initial data (if any): '{existing_organic}'"
        prompt += f"\nBase the 'chemical' response on this initial data (if any): '{existing_chemical}'"

    max_retries = 2
    for attempt in range(max_retries):
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": f"You are an API that outputs strictly valid JSON only in {target_lang}. Use exact keys: detection_string, scientificName, description, symptoms, trigger, organic, chemical.",
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.2,
                response_format={"type": "json_object"},  # <--- THIS IS THE MAGIC LINE
            )

            llm_response = json.loads(chat_completion.choices[0].message.content)

            # Merge translated strings
            if is_translating and "detection_string" in llm_response:
                db_data["detection"] = llm_response["detection_string"]

            if needs_scientific_name:
                db_data["plant"]["scientificName"] = llm_response.get(
                    "scientificName", "Details currently unavailable."
                )
            if needs_description:
                db_data["plant"]["description"] = llm_response.get(
                    "description", "Details currently unavailable."
                )
            if needs_symptoms:
                db_data["disease"]["symptoms"] = llm_response.get(
                    "symptoms", "Details currently unavailable."
                )
            if needs_trigger:
                db_data["disease"]["trigger"] = llm_response.get(
                    "trigger", "Details currently unavailable."
                )

            db_data["disease"]["organic"] = llm_response.get(
                "organic", "Details currently unavailable."
            )
            db_data["disease"]["chemical"] = llm_response.get(
                "chemical", "Details currently unavailable."
            )

            return db_data

        except Exception as e:
            if attempt == max_retries - 1:
                print(f"Groq LLM Failed after retries: {e}")
                db_data["disease"]["organic"] = (
                    "Details currently unavailable. Please try again later."
                )
                db_data["disease"]["chemical"] = (
                    "Details currently unavailable. Please try again later."
                )
                return db_data
            time.sleep(2)
