// Defines routes for userController to post API's to

import express from 'express'
// import runCompletion from "../chatGPT";
import runCompletionAssistant from "../chatGPT"

import { createUser, getUser, loginUser, updateUser } from "../controllers/userController";

const userRoutes = express.Router()

userRoutes.route("/create").post(createUser)
userRoutes.route("/login").post(loginUser)
// userRoutes.route("/chatGPT").post(runCompletion)
userRoutes.route("/chatGPT/:ownerId/:petName/:threadId").post(runCompletionAssistant)
userRoutes.route("/get/:uid").get(getUser)
userRoutes.route("/update/:uid").patch(updateUser)

export default userRoutes
