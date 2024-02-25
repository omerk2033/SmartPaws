// Defines routes for userController to post API's to

import express from 'express'
import {createUser, getUser, loginUser} from "../controllers/userController";

const userRoutes = express.Router()

userRoutes.route("/create").post(createUser)
userRoutes.route("/login").post(loginUser)
userRoutes.route("/get/:uid").get(getUser)

export default userRoutes
