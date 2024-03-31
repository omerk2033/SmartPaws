// Defines routes for userController to post API's to

import express from 'express'
// import {createUser, loginUser} from "../controllers/userController";
// import runCompletion from "../chatGPT";
import runCompletionAssistant from "../chatGPT"

import {createUser, getUser, loginUser} from "../controllers/userController";

const userRoutes = express.Router()

userRoutes.route("/create").post(createUser)
userRoutes.route("/login").post(loginUser)
// userRoutes.route("/chatGPT").post(runCompletion)
// userRoutes.route("/chatGPT").post(runCompletionAssistant)
userRoutes.route("/chatGPT/:threadId").post(runCompletionAssistant)
// userRoutes.route("/chatGPT/:ownerId/:petName").post(runCompletionAssistant)
// changing to send all of the pet profile info to the backend in the url
// yea that's not going to work lol
// userRoutes.route("/chatGPT/:name/:age/:species/:breed/:color/:gender/:vaccinationRecords/:medsSupplements/:allergiesSensitivities/:prevIllnessesInjuries/:diet/:exerciseHabits/:indoorOrOutdoor/:reproductiveStatus/:notes/:threadId").post(runCompletionAssistant)

userRoutes.route("/get/:uid").get(getUser)

export default userRoutes
