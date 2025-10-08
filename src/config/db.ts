const mongoose = require("mongoose");

async function connectDB(url: string) {
    try {
        await mongoose.connect(url);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
    
}

module.exports = {
    connectDB,
};