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

        if(threadId == "nope") {
            // maybe see about creating new thread 
            // and then sending all of the pet information to it 
            // to see if can reference in future conversations

            // ok so it seems like this is taking care of creating a new thread
            // if there wasn't already a thread id found for the pet
            const newThread = await openai.beta.threads.create();
            console.log(newThread.id);
            threadIdToUse = newThread.id;

            // and then creating the message from the pet details that were passed in the request body
            await openai.beta.threads.messages.create(newThread.id, {
                role: "user",
                content: input,
            });
            
            // it seems to be able to remember the information that you send from the pet's profile
            // at this point, it even remembered it in another thread

            // const fileName = "Bob-cwslHZYwcOS5cUDPiOFjWgBQdgg2.json";
            // const file = await openai.files.create({
            //     file: fs.createReadStream(fileName),
            //     purpose: "assistants",
            // });
            // // let existingFileIds = assistantDetails.file_ids || [];
            // await fsPromises.writeFile(
            //     fileName,
            //     JSON.stringify(file, null, 2)
            //   );

              // ok maybe could write the pet string info to a json file
            // and then upload to the chatgpt assistant
            // I've manually uploaded the file that the below creates
            // and the assistant is able to read from it successfully
            // write pet profile to json file
            // IF CAN'T UPLOAD FILE TO OPENAI THEN NO POINT TO WRITE IT TO A FILE I SUPPOSE
            // const dataToWrite = JSON.stringify(input, null, 2); // Convert to pretty-printed JSON
            // fs.writeFileSync(`${petName}-${ownerId}.json`, dataToWrite);
            // console.log('Data written to json file');

            // upload pet profile to chatgpt assistant API
            // I HAVEN'T FOUND THAT IT IS POSSIBLE TO UPLOAD A FILE TO THE ASSISTANT FROM HERE YET
            // const file = new File([Blob], 'Stimpy-cwslHZYwcOS5cUDPiOFjWgBQdgg2.json', { type: 'text/plain' }); 
            // const upload = await openai.files.create({
            //     file: file,
            //     purpose: "assistants",
            // })
            // create thread and save thread ID to send back to front end to modify pet profile 
            
        }
        // else {

        // }

        // Check if input exists
        if (!input) {
            return res.status(400).json({ error: "Input is required" });
        }

        // const currentDirectory: string = process.cwd();
        // console.log(`Current working directory: ${currentDirectory}`);
        // current working directory is SmartPawsBackend
        // const jsonContent = fs.readFileSync('assistant.json', 'utf8');
        // // get assistant configuration data from json file
        // const assistantConfiguration = JSON.parse(jsonContent);
        // // just printing
        // console.log(assistantConfiguration.assistantId);
        // console.log(assistantConfiguration.name);
        // console.log(assistantConfiguration.instructions);

        // const assistant = await openai.beta.assistants.create(assistantConfiguration);
        // const assistantDetails: AssistantDetails = { assistantId: assistant.id, ...assistantConfiguration };
        
        // Gunter's thread
        // const existingThreadId = "thread_9DcJNYRPB9bRdfwhFPMhrAZT";
        // let threadIdToUse = "";
        // just a default thread for debugging, NEED TO DITCH PROBABLY...
        // and instead check for if the threadId passed in as a parameter is not the empty string
        if(threadIdToUse == "") {
            threadIdToUse = "thread_9DcJNYRPB9bRdfwhFPMhrAZT";
        }
        // else {
        //     threadIdToUse = newThreadId;
        // }
        // if(newThreadId == "") {
        //     threadIdToUse = "thread_9DcJNYRPB9bRdfwhFPMhrAZT";
        // }
        // else {
        //     threadIdToUse = newThreadId;
        // }

        // Bill's thread
        // const existingThreadId = "thread_HT99NbUHaYVmsesVI4LQoDIJ";


        // need to check if threadId that will be passed in as a parameter 
        // is empty string, then create new thread under the assistant
        // and create new json file for the pet profile to upload to the assistant thread
        // if the threadId is not an empty string, then use that threadId to create the thread

        // COMMENTING OUT TO NOT SEND WHILE JUST VERIFYING THE STEPS BEFORE SENDING TO CHATGPT
        // const thread = { id: existingThreadId };
        console.log("thread ID to use: " + threadIdToUse);
        const thread = { id: threadIdToUse };
        console.log(thread);
        // Pass in the user question into the existing thread
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
                res.json({ message: responseText }); 
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
    // END COMMENTING OUT TO NOT SEND WHILE JUST VERIFYING THE STEPS BEFORE SENDING TO CHATGPT

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// export default runCompletion;
export default runCompletionAssistant;
