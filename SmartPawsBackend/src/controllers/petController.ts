// import bcrypt from "bcrypt"
import { Request, Response, request } from "express"
// import jwt from "jsonwebtoken"
// import { Types } from "mongoose"
import Pet from "../models/petModel"
// import { IPet } from "../types/petTypes"

// getUserToken is used for logging in, not sure if necessary here...

export const createPet = async (request: Request, response: Response) => {
    try {
        const { ownerId, name, age, 
                species, breed, color, 
                gender, microchipIdTag, vaccinationRecords, 
                medsSupplements, allergiesSensitivities, prevIllnessesInjuries, 
                behaviorTemperament, diet, exerciseHabits, 
                indoorOrOutdoor, reproductiveStatus, image, notes } = request.body
        const existingPet = await Pet.findOne({ ownerId, name }) // check if the database already contains a pet with same ownerId and name
        if (existingPet) {
            return response.status(409).send("pet already exists")
        }

        // not doing anything with generating a password
        // because creating a pet should be tied in already with user being logged in 

        const pet = Pet.create({
            ownerId: ownerId,
            name: name,
            age: age,
            species: species,
            breed: breed,
            color: color,
            gender: gender,
            microchipIdTag: microchipIdTag, // DITCH
            vaccinationRecords: vaccinationRecords,
            medsSupplements: medsSupplements,
            allergiesSensitivities: allergiesSensitivities,
            prevIllnessesInjuries: prevIllnessesInjuries,
            behaviorTemperament: behaviorTemperament, // DITCH
            diet: diet,
            exerciseHabits: exerciseHabits,
            indoorOrOutdoor: indoorOrOutdoor,
            reproductiveStatus: reproductiveStatus,
            image: image,
            notes: notes,
        })

        return response.status(201).send({ message: "Pet created successfully" })

    } catch (error) {
        console.log("error in createPet", error)
        throw error
    }
}

// need method similar to loginUser that would display pet(s)...
// sends request with ownerId specified like http://localhost:1337/pet/get/123456
// and gets all pets that have same ownerId as currently logged in user's uid
export const getPets = async (request: Request, response: Response) => {
    try {
        const { ownerId } = request.params
        const pets = await Pet.find({ ownerId })
        console.log(pets)
        return response.status(200).send(pets)
    } catch (error) {
        console.log("error in getPets", error)
        throw error
    }
}