import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to DB!");
  } catch (error) {
    console.log("Unable to connect!");
    console.log(error.message);
    console.log(error);
    process.exit(1);
  }
};
