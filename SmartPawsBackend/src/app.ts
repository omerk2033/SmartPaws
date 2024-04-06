import "dotenv/config";
import express from "express";
import userRoutes from "./routes/userRoutes";
import petRoutes from "./routes/petRoutes";
import { petEventEmitter } from "./controllers/petController";


// ExpressJS code to define server and main route.

const application = express();
application.use(express.json())

application.use("/user", userRoutes)
application.use("/pet", petRoutes)

petEventEmitter.on('petConcernToggled', (pet) => {
    console.log(`Notification: ${pet.name} has been flagged for concern by ${pet.ownerId}.`);
});

export default application;


