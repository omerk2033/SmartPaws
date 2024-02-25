import "dotenv/config";
import express from "express";
import userRoutes from "./routes/userRoutes";
import petRoutes from "./routes/petRoutes";

// ExpressJS code to define server and main route.

const application = express();
application.use(express.json())

application.use("/user", userRoutes)
application.use("/pet", petRoutes)

export default application;


