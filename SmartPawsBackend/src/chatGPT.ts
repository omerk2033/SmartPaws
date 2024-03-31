import OpenAI from 'openai';
import { Request, Response } from "express";

// import { assistantID } from "../assistant.json";
// had to "resolveJsonModule": true in tsconfig.json to be able to import json file
// import { assistantId as assistantID } from "../assistant.json";
import fs from 'fs'; // Import the 'fs' module for file operations
import * as process from 'process';

// interface AssistantDetails {
//     assistantId: string;
//     name: string;
//     instructions: string;
//     tools: { type: string }[]; // Adjust this based on the actual structure
//     model: string;
// }

// Ensure OPENAI_API_KEY environment variable is set
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is missing or empty");
}

const openai = new OpenAI({ apiKey });

// commenting out to use new function runCompletionAssistant for configuration with specific assistant and specific thread
// async function runCompletion(req: Request, res: Response) {
//     try {        
//         // Extract input from the request body
//         const { input } = req.body;

//         // Check if input exists
//         if (!input) {
//             return res.status(400).json({ error: "Input is required" });
//         }

//         // Call OpenAI's completion endpoint
//         const completion = await openai.chat.completions.create({
//             messages: [{ role: "user", content: input }],
//             model: "gpt-3.5-turbo",
//         });

//         // Return the response
//         res.json(completion.choices[0]);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }

// just messing with trying to use the assistant api
async function runCompletionAssistant(req: Request, res: Response) {
    try {
        // Extract input from the request body
        const { input } = req.body;

        // Check if input exists
        if (!input) {
            return res.status(400).json({ error: "Input is required" });
        }

        // get threadId passed in as a parameter
        const { threadId } = req.params;
        console.log("threadId: " + threadId);
        // console.log("backend");
        // const { name, age, species, breed, color, gender, vaccinationRecords, medsSupplements, allergiesSensitivities, prevIllnessesInjuries, diet, exerciseHabits, indoorOrOutdoor, reproductiveStatus, notes, threadId } = req.params;
        // console.log("name: " + name);
        // console.log("age: " + age);
        // console.log("species: " + species);
        // console.log("breed: " + breed);
        // console.log("color: " + color);
        // console.log("gender: " + gender);
        // console.log("vaccinationRecords: " + vaccinationRecords);
        // console.log("medsSupplements: " + medsSupplements);
        // console.log("allergiesSensitivities: " + allergiesSensitivities);
        // console.log("prevIllnessesInjuries: " + prevIllnessesInjuries);
        // console.log("diet: " + diet);
        // console.log("exerciseHabits: " + exerciseHabits);
        // console.log("indoorOrOutdoor: " + indoorOrOutdoor);
        // console.log("reproductiveStatus: " + reproductiveStatus);
        // console.log("notes: " + notes);
        // console.log("threadId: " + threadId);

        // const currentDirectory: string = process.cwd();
        // console.log(`Current working directory: ${currentDirectory}`);
        // current working directory is SmartPawsBackend
        const jsonContent = fs.readFileSync('assistant.json', 'utf8');
        // get assistant configuration data from json file
        const assistantConfiguration = JSON.parse(jsonContent);
        // just printing
        console.log(assistantConfiguration.assistantId);
        console.log(assistantConfiguration.name);
        console.log(assistantConfiguration.instructions);

        // const assistant = await openai.beta.assistants.create(assistantConfiguration);
        // const assistantDetails: AssistantDetails = { assistantId: assistant.id, ...assistantConfiguration };
        
        // Gunter's thread
        const existingThreadId = "thread_9DcJNYRPB9bRdfwhFPMhrAZT";



        // need to check if threadId that will be passed in as a parameter 
        // is empty string, then create new thread under the assistant
        // and create new json file for the pet profile to upload to the assistant thread
        // if the threadId is not an empty string, then use that threadId to create the thread

        // COMMENTING OUT TO NOT SEND WHILE JUST VERIFYING THE STEPS BEFORE SENDING TO CHATGPT
        // const thread = { id: existingThreadId };
        // // Pass in the user question into the existing thread
        // await openai.beta.threads.messages.create(thread.id, {
        //     role: "user",
        //     content: input,
        // });
    
        // // Create a run
        // const run = await openai.beta.threads.runs.create(thread.id, {
        //     assistant_id: assistantConfiguration.assistantId,
        // });
    
        // // Immediately fetch run status, which will be "in_progress" or "complete"
        // let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        // console.log("Run status:", runStatus.status);

        // // Polling mechanism to see if runStatus is completed
        // while (runStatus.status !== "completed") {
        //     await new Promise((resolve) => setTimeout(resolve, 1000));
        //     runStatus = await openai.beta.threads.runs.retrieve(
        //         thread.id,
        //         run.id
        //     );

        //     // Check for failed, cancelled, or expired status
        //     if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
        //     console.log(
        //         `Run status is '${runStatus.status}'. Unable to complete the request.`
        //     );
        //     break; // Exit the loop if the status indicates a failure or cancellation
        //     }
        // }

        // // Get the last assistant message from the messages array
        // const messages = await openai.beta.threads.messages.list(thread.id);

        // // Find the last message for the current run
        // const lastMessageForRun = messages.data
        //     .filter(
        //     (message) =>
        //         message.run_id === run.id && message.role === "assistant"
        //     )
        //     .pop();

        // // If an assistant message is found, console.log() it
        // if (lastMessageForRun) {
        //     // console.log(`${lastMessageForRun.content[0].text.value} \n`);
        //     const content = lastMessageForRun.content[0];
        //     if ("text" in content) {
        //         // It's a MessageContentText
        //         console.log(`${content.text.value} \n`);
        //         const responseText = content.text.value;
        //         res.json({ message: responseText }); 
        //       } else {
        //         // It's a MessageContentImageFile (handle accordingly)
        //         console.log("Received an image content. Handle appropriately.");
        //         res.status(400).json({ error: "Received an image content. Handle appropriately." });
        //       }
        // } else if (
        //     !["failed", "cancelled", "expired"].includes(runStatus.status)
        // ) {
        //     console.log("No response received from the assistant.");
        // }
    // END COMMENTING OUT TO NOT SEND WHILE JUST VERIFYING THE STEPS BEFORE SENDING TO CHATGPT

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// export default runCompletion;
export default runCompletionAssistant;
