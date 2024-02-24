import express from 'express'
import { createPet, getOnePet, getPets } from "../controllers/petController"

const petRoutes = express.Router()

petRoutes.route("/create").post(createPet)
petRoutes.route("/get/:ownerId").get(getPets) // get request specifies ownerId/user's uid to get pets associated with logged in user
petRoutes.route("/get/:ownerId/:petName").get(getOnePet) // get request to get 1 pet found by owner id and pet name in url 


export default petRoutes