import urllib.request
import json
from app.controllers import blueprint, mongo, jsonify, datetime, resnet, request
from app.schemas import validate_detectionHistory
from bson.objectid import ObjectId
import flask
from flask_cors import CORS, cross_origin
from app.llm_enhancer import enhance_diagnostic_data


@blueprint.route("/api/dl", methods=["GET"])
def hello():
    return "Hello, World!"


@blueprint.route("/api/dl/prediction/test", methods=["GET"])
def test1():
    print(ObjectId("623a3d74960a9f8526395e08"))
    data = validate_detectionHistory(
        {
            "createdAt": str(datetime.now()),
            "plantId": ObjectId("623a3d74960a9f8526395e08"),
        }
    )
    if data["ok"]:
        data = data["data"]
        print(mongo.db.detectionHistory.find_one())
        print(type(mongo.db.detectionHistory.find_one()["_id"]))
        mongo.db.detectionHistory.insert_one(data)
        return jsonify(
            {
                "ok": True,
                "message": "User created successfully!",
                "detectionHistory": data,
            }
        ), 200

    return jsonify(
        {"ok": False, "message": "Bad request parameters: {}".format(data["message"])}
    ), 400


@blueprint.route("/api/dl/detection", methods=["POST"])
@cross_origin(supports_credentials=True)
def dl_detection():
    try:
        # ==========================================
        # NEW: Fetch IP & Location directly in Python!
        # ==========================================
        try:
            with urllib.request.urlopen("http://ip-api.com/json/", timeout=3) as url:
                ip_data = json.loads(url.read().decode())
                ip = ip_data.get("query", "127.0.0.1")
                state = ip_data.get("region", "RJ")  # Gets "RJ" for Rajasthan
                city = ip_data.get("city", "Jaipur")
                district = city
                lat = ip_data.get("lat", 26.9124)
                lon = ip_data.get("lon", 75.7873)
        except Exception as e:
            # Fallback to Rajasthan if the API fails
            ip = "127.0.0.1"
            state = "RJ"
            city = "Jaipur"
            district = "Jaipur"
            lat = 26.9124
            lon = 75.7873

        image = request.files["image"]
        detection = resnet.predict_image(image)
        print("Detected:", detection)
        detection_split = detection.split("___")
        plant, disease = detection_split[0], detection_split[1]

        disease_info = mongo.db.disease.find_one({"name": detection})
        plant_info = mongo.db.plants.find_one({"commonName": plant})

        # Override createdAt to a datetime object so the Dashboard $gte query works!
        current_time = datetime.now()

        detectionHistory = {
            "createdAt": current_time,
            "ip": ip,
            "city": city,
            "district": district,
            "state": state,  # Now strictly saves as "RJ"!
            "location": {"lat": lat, "lon": lon},
            "detected_class": detection,
            "plantId": plant_info["_id"]
            if plant_info
            else ObjectId("507f191e810c19729de860ea"),
            "diseaseId": disease_info["_id"]
            if disease_info
            else ObjectId("507f191e810c19729de860ea"),
            "rating": 5,
        }

        validated_detectionHistory = validate_detectionHistory(detectionHistory)

        if validated_detectionHistory["ok"]:
            data_to_insert = validated_detectionHistory["data"]
            data_to_insert["createdAt"] = current_time
            mongo.db.detectionHistory.insert_one(data_to_insert)
        else:
            print("Validation failed:", validated_detectionHistory["message"])
            detectionHistory["createdAt"] = current_time
            mongo.db.detectionHistory.insert_one(detectionHistory)

        fallback_plant = {
            "commonName": plant,
            "scientificName": "N/A",
            "description": "Not found in database.",
        }
        fallback_disease = {
            "name": detection,
            "symptoms": "N/A",
            "trigger": "N/A",
            "organic": "N/A",
            "chemical": "N/A",
        }

        # 1. Prepare the raw data dictionary
        raw_response_data = {
            "ok": True,
            "detection": detection,
            "plant": plant_info if plant_info else fallback_plant,
            "disease": disease_info if disease_info else fallback_disease,
        }

        # 2. Extract the language sent from the React frontend
        lang = request.form.get("lang", "en")

        # 3. Pass the language to our LLM Enhancer
        enhanced_data = enhance_diagnostic_data(detection, raw_response_data, lang)

        # 4. Return the enhanced data back to the frontend
        response = flask.jsonify(enhanced_data)
        return response

    except Exception as ex:
        print("ERROR:", ex)
        return flask.jsonify({"ok": False, "message": str(ex)}), 500

    # print(ObjectId("623a3d74960a9f8526395e08"))
    # data = validate_detectionHistory({"createdAt":str(datetime.now()),"plantId":ObjectId("623a3d74960a9f8526395e08")})
    # if data['ok']:
    #     data = data['data']
    #     print(mongo.db.detectionHistory.find_one())
    #     print(type(mongo.db.detectionHistory.find_one()['_id']))
    #     mongo.db.detectionHistory.insert_one(data)
    #     return jsonify({'ok': True, 'message': 'User created successfully!','detectionHistory':data}), 200
