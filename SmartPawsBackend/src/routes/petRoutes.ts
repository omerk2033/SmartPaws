import express from 'express'
import { createPet, getPets } from "../controllers/petController"

const petRoutes = express.Router()

petRoutes.route("/create").post(createPet)
petRoutes.route("/get/:ownerId").get(getPets) // get request specifies ownerId/user's uid to get pets associated with logged in user


export default petRoutes