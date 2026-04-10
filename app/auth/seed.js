require("dotenv").config();
const mongoose = require("mongoose");
const Plant = require("./models/Plant.model");
const Disease = require("./models/Disease.model");

// The 38 classes from your classes.txt file
const classString = "Apple___Apple_scab,Apple___Black_rot,Apple___Cedar_apple_rust,Apple___healthy,Blueberry___healthy,Cherry_(including_sour)___Powdery_mildew,Cherry_(including_sour)___healthy,Corn_(maize)___Cercospora_leaf_spotGray_leaf_spot,Corn_(maize)___Common_rust_,Corn_(maize)___Northern_Leaf_Blight,Corn_(maize)___healthy,Grape___Black_rot,Grape___Esca_(Black_Measles),Grape___Leaf_blight_(Isariopsis_Leaf_Spot),Grape___healthy,Orange___Haunglongbing_(Citrus_greening),Peach___Bacterial_spot,Peach___healthy,Pepper_bell___Bacterial_spot,Pepper_bell___healthy,Potato___Early_blight,Potato___Late_blight,Potato___healthy,Raspberry___healthy,Soybean___healthy,Squash___Powdery_mildew,Strawberry___Leaf_scorch,Strawberry___healthy,Tomato___Bacterial_spot,Tomato___Early_blight,Tomato___Late_blight,Tomato___Leaf_Mold,Tomato___Septoria_leaf_spot,Tomato___Spider_mitesTwo-spotted_spider_mite,Tomato___Target_Spot,Tomato___Tomato_Yellow_Leaf_Curl_Virus,Tomato___Tomato_mosaic_virus,Tomato___healthy";

// Ensure this matches your actual MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27018/test";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // Optional: Clear existing collections to avoid duplicates if you run this multiple times
    console.log("Clearing old data...");
    await Plant.deleteMany({});
    await Disease.deleteMany({});

    const classesArray = classString.split(",");
    const plantMap = {};

    // Group diseases by plant
    for (const fullClassName of classesArray) {
      const parts = fullClassName.split("___");
      const plantName = parts[0];
      const diseaseName = parts[1];

      if (!plantMap[plantName]) {
        plantMap[plantName] = [];
      }
      plantMap[plantName].push({ fullClassName, diseaseName });
    }

    console.log("Inserting Plants and Diseases...");

    // Insert into database
    for (const plantName of Object.keys(plantMap)) {
      const diseaseIds = [];

      // 1. Create all diseases for this plant
      for (const d of plantMap[plantName]) {
        const newDisease = await Disease.create({
          name: d.fullClassName, // Must exactly match the DL output (e.g., Apple___Apple_scab)
          thumbnail: "default_disease.jpg",
          symptoms: d.diseaseName === "healthy" ? "None" : `Standard symptoms for ${d.diseaseName.replace(/_/g, ' ')}`,
          trigger: d.diseaseName === "healthy" ? "None" : "Environmental factors",
          organic: d.diseaseName === "healthy" ? "N/A" : "Neem oil / Organic fungicides",
          chemical: d.diseaseName === "healthy" ? "N/A" : "Standard chemical fungicides"
        });
        diseaseIds.push(newDisease._id);
      }

      // 2. Create the plant and link the disease IDs
      await Plant.create({
        commonName: plantName, // Must exactly match the DL output prefix (e.g., Apple)
        scientificName: `${plantName} scientifica`,
        description: `General information about ${plantName.replace(/_/g, ' ')}.`,
        thumbnail: "default_plant.jpg",
        diseases: diseaseIds
      });
    }

    console.log("✅ Database seeded successfully!");
    console.log(`Created ${Object.keys(plantMap).length} Plants and ${classesArray.length} Diseases.`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    mongoose.connection.close();
    console.log("Disconnected from MongoDB.");
  }
}

seedDatabase();