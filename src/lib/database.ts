import mongoose from "mongoose";

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};