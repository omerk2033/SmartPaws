import OpenAI from 'openai';
import { Request, Response } from "express";

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

// const fsPromises = fs.promises;

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
        console.log("Backend input received:", input);

        // parameters passed in in url
        const { ownerId, petName, threadId } = req.params;
        console.log("ownerId: " + ownerId);
        console.log("petName: " + petName);
        console.log("threadId: " + threadId);

        // get assistant configuration data from json file
        const jsonContent = fs.readFileSync('assistant.json', 'utf8');
        const assistantConfiguration = JSON.parse(jsonContent);
        // just printing
        console.log(assistantConfiguration.assistantId);
        console.log(assistantConfiguration.name);
        console.log(assistantConfiguration.instructions);

        // threadIdToUse will be created fresh if threadID is nope
        // or set to the threadId that was passed in in the url
        let threadIdToUse = "";

        // if thread has not been associated with the pet profile
        if(threadId == "nope") {
            // this is taking care of creating a new thread
            // if there wasn't already a thread id found for the pet
            const newThread = await openai.beta.threads.create();
            console.log(newThread.id);
            threadIdToUse = newThread.id;

            // create the message from the pet details that were passed in the request body
            // the assistant will be able to reference in future same thread conversations
            await openai.beta.threads.messages.create(newThread.id, {
                role: "user",
                content: input,
            });
            
            // I do not find a way to upload a file to the assistant like I can manually do
            // tried stuff like below, but wasn't able to get to work
            // const dataToWrite = JSON.stringify(input, null, 2); // Convert to pretty-printed JSON
            // fs.writeFileSync(`${petName}-${ownerId}.json`, dataToWrite);
            // console.log('Data written to json file');
        }
        else {
            threadIdToUse = threadId;
            console.log("threadIdToUse that would have been already associated with the pet profile: " + threadIdToUse);
        }

        // Check if input exists
        if (!input) {
            return res.status(400).json({ error: "Input is required" });
        }

        console.log("thread ID to use: " + threadIdToUse);
        const thread = { id: threadIdToUse };
        console.log(thread);
        // Pass in the user question into the existing thread
        // thread will either be newly created thread or preexisting thread of same thread id that was passed in url
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: input,
        });

        // Create a run
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistantConfiguration.assistantId,
        });
    
        // Immediately fetch run status, which will be "in_progress" or "complete"
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        console.log("Run status:", runStatus.status);

        // Polling mechanism to see if runStatus is completed
        while (runStatus.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(
                thread.id,
                run.id
            );

            // Check for failed, cancelled, or expired status
            if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
                console.log(
                    `Run status is '${runStatus.status}'. Unable to complete the request.`
                );
                break; // Exit the loop if the status indicates a failure or cancellation
            }
        }

        // Get the last assistant message from the messages array
        const messages = await openai.beta.threads.messages.list(thread.id);

        // Find the last message for the current run
        const lastMessageForRun = messages.data
            .filter(
            (message) =>
                message.run_id === run.id && message.role === "assistant"
            )
            .pop();

        // If an assistant message is found, console.log() it
        if (lastMessageForRun) {
            // console.log(`${lastMessageForRun.content[0].text.value} \n`);
            const content = lastMessageForRun.content[0];
            if ("text" in content) {
                // It's a MessageContentText
                console.log(`${content.text.value} \n`);
                const responseText = content.text.value;
                // res.json({ message: responseText }); 
                res.json({ message: responseText, threadId: threadIdToUse }); 
              } else {
                // It's a MessageContentImageFile (handle accordingly)
                console.log("Received an image content. Handle appropriately.");
                res.status(400).json({ error: "Received an image content. Handle appropriately." });
              }
        } else if (
            !["failed", "cancelled", "expired"].includes(runStatus.status)
        ) {
            console.log("No response received from the assistant.");
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// export default runCompletion;
export default runCompletionAssistant;
