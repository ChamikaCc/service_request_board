import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_UR);
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.error("Database Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;