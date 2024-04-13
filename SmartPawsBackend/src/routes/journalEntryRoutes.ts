import express from 'express';
import { createJournalEntry, getJournalEntriesOnePet } from "../controllers/journalEntryController";

const journalEntryRoutes = express.Router();

journalEntryRoutes.route("/create").post(createJournalEntry);
journalEntryRoutes.route("/get/:ownerId/:petName").get(getJournalEntriesOnePet);

export default journalEntryRoutes;
