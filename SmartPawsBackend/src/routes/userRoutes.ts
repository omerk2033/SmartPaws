// Defines routes for userController to post API's to

import express from 'express'
import {createUser, loginUser} from "../controllers/userController";
import runCompletion from "../chatGPT";


const userRoutes = express.Router()

userRoutes.route("/create").post(createUser)
userRoutes.route("/login").post(loginUser)
userRoutes.route("/chatGPT").post(runCompletion)



export default userRoutes
