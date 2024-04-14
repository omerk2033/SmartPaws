// create journal entries from mongodb
// get journal entries from mongodb

import { Request, Response } from "express";
import JournalEntry from "../models/journalEntryModel";

export const createJournalEntry = async (request: Request, response: Response) => {
  try {
    const { ownerId, petName, date, entry } = request.body;

    // don't need to check for duplicates since user could make multiple journal entries for the same pet

    await JournalEntry.create({
      ownerId: ownerId,
      petName: petName,
      date: date,
      entry: entry
    })

    return response.status(201).send({ message: "Journal Entry created successfully" })

  } catch (error) {
    console.log("Error in journal entry creation");
    throw error;
  }
}

export const getJournalEntriesOnePet = async (request: Request, response: Response) => {
  try {
    const { ownerId, petName } = request.params
    const journalEntries = await JournalEntry.find({ ownerId, petName });
    console.log(journalEntries)
    return response.status(200).send(journalEntries)
  } catch (error) {
    console.log("error in getJournalEntriesOnePet", error)
    throw error
  }
}

// don't know if need to worry about deleting a journal entry...
