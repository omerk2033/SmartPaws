// Defines routes for userController to post API's to

import express from 'express'
import {createUser, loginUser} from "../controllers/userController";

const userRoutes = express.Router()

userRoutes.route("/create").post(createUser)
userRoutes.route("/login").post(loginUser)


export default userRoutes