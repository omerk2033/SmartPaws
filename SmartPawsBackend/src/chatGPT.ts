// interact with openai assistant api send question/receive response 
// on unique conversation thread for each pet
// create new thread if 1st interaction, if not use same thread

import OpenAI from 'openai';
import { Request, Response } from "express";

import fs from 'fs'; // to read assistant.json configuration from file
import * as process from 'process';

// Ensure OPENAI_API_KEY environment variable is set
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY environment variable is missing or empty");
}

const openai = new OpenAI({ apiKey });

// using the openai assistant api
async function runCompletionAssistant(request: Request, response: Response) {
  try {
    const { input } = request.body;
    console.log("Backend input received:", input);

    // get parameters passed in from url
    const { ownerId, petName, threadId } = request.params;
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

    // threadIdToUse will be created fresh if threadID is "nope"
    // or set to the threadId that was passed in in the url
    let threadIdToUse = "";

    // if thread has not been associated with the pet profile
    if (threadId == "nope") {
      // if there wasn't already a thread id found for the pet "nope"
      // create a new thread for this pet profile to exclusively own
      const newThread = await openai.beta.threads.create();
      console.log(newThread.id);
      threadIdToUse = newThread.id;

      // create the message from the pet details that were passed in the request body
      // the assistant will be able to reference in future same thread conversations
      await openai.beta.threads.messages.create(newThread.id, {
        role: "user",
        content: input,
      });

    }
    else { // since threadId is not "nope", should be a valid threadId 
      threadIdToUse = threadId;
      console.log("threadIdToUse that would have been already associated with the pet profile: " + threadIdToUse);
    }

    // Check if input exists
    if (!input) {
      return response.status(400).json({ error: "Input is required" });
    }

    console.log("thread ID to use: " + threadIdToUse);

    // Pass in the user question into the existing thread
    // thread will either be newly created thread or preexisting thread of same thread id that was passed in url
    await openai.beta.threads.messages.create(threadIdToUse, {
      role: "user",
      content: input,
    });

    // Create a run 
    const run = await openai.beta.threads.runs.create(threadIdToUse, {
      assistant_id: assistantConfiguration.assistantId,
    });

    // Immediately fetch run status, which will be "in_progress" or "complete"
    let runStatus = await openai.beta.threads.runs.retrieve(threadIdToUse, run.id);
    console.log("Run status:", runStatus.status);

    // Polling mechanism to see if runStatus is completed
    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(
        threadIdToUse,
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
    const messages = await openai.beta.threads.messages.list(threadIdToUse);

    // Find the last message for the current run
    const lastMessageForRun = messages.data
      .filter(
        (message) =>
          message.run_id === run.id && message.role === "assistant"
      )
      .pop();

    // If an assistant message is found, console.log() it
    if (lastMessageForRun) {
      const content = lastMessageForRun.content[0];
      if ("text" in content) {
        // It's a MessageContentText
        console.log(`${content.text.value} \n`);
        const responseText = content.text.value;
        // send threadId back as well as message to frontend to update pet profile in database
        response.json({ message: responseText, threadId: threadIdToUse });
      } else {
        // check if image was sent, not handling image responses 
        console.log("Received an image content. Handle appropriately.");
        response.status(400).json({ error: "Received an image content. Handle appropriately." });
      }
    } else if ( // check for failure responses
      !["failed", "cancelled", "expired"].includes(runStatus.status)
    ) {
      console.log("No response received from the assistant.");
    }

  } catch (error) {
    console.error("Error:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
}

export default runCompletionAssistant;
