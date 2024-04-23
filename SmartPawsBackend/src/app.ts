import "dotenv/config";
import express from "express";
import userRoutes from "./routes/userRoutes";
import petRoutes from "./routes/petRoutes";
import { petEventEmitter } from "./controllers/petController";
import journalEntryRoutes from "./routes/journalEntryRoutes";


// ExpressJS code to define server and routes.

const application = express();
application.use(express.json());

application.use("/user", userRoutes);
application.use("/pet", petRoutes);
application.use("/journalEntry", journalEntryRoutes);

petEventEmitter.on('petConcernToggled', (pet) => {
    console.log(`Notification: ${pet.name} has been flagged for concern by ${pet.ownerId}.`);
});

export default application;


