import mongoose from "mongoose";

const petSchema=new mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    species: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
    },
    color: {
        type: String,
    },
    gender: {
        type: String,
    },
    vaccinationRecords: {
        type: String,
        // perhaps image files could be uploaded...
    },
    medsSupplements: {
        type: String,
    },
    allergiesSensitivities: {
        type: String,
    },
    prevIllnessesInjuries: {
        type: String,
    },
    diet: {
        type: String,
    },
    exerciseHabits: {
        type: String,
    },
    indoorOrOutdoor: {
        type: String,
    },
    reproductiveStatus: {
        type: String,
    },
    image: {
        type: String,
        // need to figure out about handling an image file...
        // type: Buffer,
        // saving to some cloud storage and then saving the url to that cloud storage is recommended
        // instead of saving to Buffer and then saving in mongo
    },
    notes: {
        type: String,
        // perhaps an array of notes...
    },

},
    {
        timestamps: true,        
    }
)

const Pet = mongoose.model("Pet", petSchema)

export default Pet