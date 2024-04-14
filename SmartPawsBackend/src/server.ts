import application from "./app";
import env from "./util/validateEnv";
import * as mongoose from "mongoose";

const port = env.PORT
// Connects to MongoDB Database and Starts development server.
const connectToDatabase = async () => {

  try {
    const connection = await mongoose.connect(env.MONGODB_CONNECTION_STRING)
    if (connection) {
      console.log("Mongoose connected!")
    }
    // application imported from app.ts signifies the initial routes for /user and /pet
    application.listen(port, () => {
      console.log("Server running: " + port);
    });

  } catch (error) {
    console.log("error in connecting to database...")
  }


}

export default connectToDatabase()