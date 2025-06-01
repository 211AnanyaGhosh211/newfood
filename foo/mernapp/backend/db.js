const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

const mongoDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("✅ Connected to MongoDB successfully");

        const db = mongoose.connection.db;

        const collections = await db.listCollections().toArray();
        console.log("📂 Collections found:", collections.map(c => c.name));

        const collectionExists = collections.some(c => c.name === "grabfood");
        if (!collectionExists) {
            console.error("❌ ERROR: Collection 'grabfood' does not exist!");
            return;
        }

        console.log("✅ Collection 'grabfood' exists! Fetching data...");

        const foodItemsCollection = db.collection("grabfood");
        const foodCategoryCollection = db.collection("grabfoodCategory");

        const foodItems = await foodItemsCollection.find({}).toArray();
        const foodCategories = await foodCategoryCollection.find({}).toArray();

        global.food_items = foodItems;//data
        global.foodCategory = foodCategories; //catData

        console.log("🍕 Data successfully fetched and stored in global variables");

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

module.exports = mongoDB;
