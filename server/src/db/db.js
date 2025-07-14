import mongoose from "mongoose";

export const db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb is connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Unable to connect to Database - ${error.message}`);
  }
};
