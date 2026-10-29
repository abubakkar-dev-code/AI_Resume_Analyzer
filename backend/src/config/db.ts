import mongoose from "mongoose";
import { env } from "./env.js";


const connectDb = async () => {
  try {
    await mongoose.connect(env?.mongodbUri);
    console.log("connected to database successfully")
  } catch (error) {
    console.log(`error in connecting Db ${error}`);
    process.exit(1)
  }
};

export default connectDb;
