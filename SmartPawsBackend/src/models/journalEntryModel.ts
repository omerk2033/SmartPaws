import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true
    },
    petName: {
        type: String,
        required: true
    },
    date: {
        type: String,
    },
    entry: {
        type: String
    }
})

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);

export default JournalEntry;