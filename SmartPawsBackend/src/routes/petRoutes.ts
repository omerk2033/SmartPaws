import express from 'express'
import { createPet } from "../controllers/petController"

const petRoutes = express.Router()

petRoutes.route("/create").post(createPet)


export default petRoutes