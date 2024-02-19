interface IUser {
    email: string
    name: string
    uid: string
    password: string
}

// adding pet interface
interface IPet {
    ownerId: string
    name: string
    age: string
    species: string
    breed: string
    color: string
    gender: string
    microchipIdTag: string
    vaccinationRecords: string
    medsSupplements: string
    allergiesSensitivities: string
    prevIllnessesInjuries: string
    behaviorTemperament: string
    diet: string
    exerciseHabits: string
    indoorOrOutdoor: string
    reproductiveStatus: string
    image: string
    notes: string
}

export interface IAuthenticatedUser {
    email: string
    name: string
}



