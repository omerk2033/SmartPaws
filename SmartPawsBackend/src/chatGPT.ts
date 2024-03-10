import OpenAI from 'openai';
import {Request, Response} from "express";

// Ensure OPENAI_API_KEY environment variable is set
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is missing or empty");
}

const openai = new OpenAI({ apiKey });

async function runCompletion(req: Request, res: Response) {
    try {
        // Extract input from the request body
        const { input } = req.body;

        // Check if input exists
        if (!input) {
            return res.status(400).json({ error: "Input is required" });
        }

        // Call OpenAI's completion endpoint
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: input }],
            model: "gpt-3.5-turbo",
        });

        // Return the response
        res.json(completion.choices[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export default runCompletion;
