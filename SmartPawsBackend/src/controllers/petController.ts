import { Request, Response } from "express"
import Pet from "../models/petModel"

export const createPet = async (request: Request, response: Response) => {
    try {
        const { ownerId, name, age, 
                species, breed, color, 
                gender, vaccinationRecords, 
                medsSupplements, allergiesSensitivities, prevIllnessesInjuries, 
                diet, exerciseHabits, indoorOrOutdoor, 
                reproductiveStatus, image, notes } = request.body
        
        // NOT SURE THAT THIS IS WORKING FOR CHECKING IF AN OWNER ALREADY HAS A PET WITH THE SAME NAME, NEED TO TEST...
        const existingPet = await Pet.findOne({ ownerId, name }) // check if the database already contains a pet with same ownerId and name
        if (existingPet) {
            return response.status(409).send("pet already exists")
        }

        // not doing anything with generating a password
        // because creating a pet should be tied in already with user being logged in 

        // const pet = Pet.create({
        await Pet.create({
            ownerId: ownerId,
            name: name,
            age: age,
            species: species,
            breed: breed,
            color: color,
            gender: gender,
            vaccinationRecords: vaccinationRecords,
            medsSupplements: medsSupplements,
            allergiesSensitivities: allergiesSensitivities,
            prevIllnessesInjuries: prevIllnessesInjuries,
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

// getPets is called in petRoutes.ts in the get request
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

// get pet based on ownerId and pet name
export const getOnePet = async (request: Request, response: Response) => {
    try {
        const { ownerId, petName } = request.params
        const pet = await Pet.findOne({ "ownerId": ownerId, "name": petName })
        console.log(pet)
        return response.status(200).send(pet)
    } catch (error) {
        console.log("error in getOnePet")
        throw error
    }
}

// delete pet based on ownerId and pet name
export const deleteOnePet = async (request: Request, response: Response) => {
    try {
        const { ownerId, petName } = request.params
        const pet = await Pet.findOneAndDelete({ "ownerId": ownerId, "name": petName });
        console.log(pet)
        if (!pet) {
            return response.status(400).json("Pet not found")
        }
        response.status(200).json("Pet deleted successfully")
        console.log("pet deleted from database")
    } catch (error) {
        console.log("error in deleteOnePet")
        throw error
    }
}

// update pet based on ownerId and pet name
export const updatePet = async (request: Request, response: Response) => {
    try {
        const { ownerId, petName } = request.params;
        const petUpdatedData = request.body;
        
        // mongoose function to find record in database and update it
        // locates record based on ownerId and petName
        // and then updates the record with the new pet data
        const pet = await Pet.findOneAndUpdate(
            { "ownerId": ownerId, "name": petName },
            petUpdatedData,
            { new: true, upsert: true }
        );

        console.log(pet);
        
        if(!pet) {
            return response.status(400).json("pet not found");
        }

        response.status(200).json("pet profile updated successfully");
        console.log("pet profile updated in database");
    } catch (error) {
        console.log("error in updatePet");
        throw error;
    }
}