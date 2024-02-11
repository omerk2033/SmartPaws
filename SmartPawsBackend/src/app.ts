import "dotenv/config";
import express from "express";
import userRoutes from "./routes/userRoutes";

// ExpressJS code to define server and main route.

const application = express();
application.use(express.json())

application.use("/user", userRoutes)

export default application;