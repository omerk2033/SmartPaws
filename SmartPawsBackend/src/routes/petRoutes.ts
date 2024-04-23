// defines routes for petController to post to

import express from 'express';
import { petConcernToggle, createPet, deleteOnePet, getOnePet, getPets, updatePet } from "../controllers/petController";

const petRoutes = express.Router();

petRoutes.route("/create").post(createPet);
petRoutes.route("/get/:ownerId").get(getPets); // get request specifies ownerId/user's uid to get pets associated with logged in user
petRoutes.route("/get/:ownerId/:petName").get(getOnePet); // get request to get 1 pet found by owner id and pet name in url 
petRoutes.route("/delete/:ownerId/:petName").delete(deleteOnePet); // delete 1 pet
petRoutes.route("/update/:ownerId/:petName").put(updatePet); // update preexisting pet profile
petRoutes.route("/toggleConcern/:ownerId/:petName").patch(petConcernToggle); //for concern toggle-able button

export default petRoutes