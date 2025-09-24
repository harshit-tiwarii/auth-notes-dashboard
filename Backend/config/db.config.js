import mongoose from "mongoose";

const dbConnection = async ()=> {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log("Database connected")
  } catch (error) {
    console.error(error)
    process.exit(1);
  }
}

export default dbConnection