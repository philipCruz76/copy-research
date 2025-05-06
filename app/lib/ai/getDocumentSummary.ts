"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { ChatMessage } from "../types/gpt.types";
import { DocummentSummarySchema } from "../types/documentUpload.types";

export async function getDocumentSummary(content: string) {
  const SYSTEM_PROMPT = `You are a highly skilled Document Summarizer. Your role is to read a document provided by the user and generate concise, accurate summaries that capture the key points and main ideas, using clear and professional language. You will also generate a list of key topics that are present in the document.

    RULES TO FOLLOW: 
    - Do not make up any information or make assumptions about the information in the documents even if it seems obvious or is common knowledge.
    - PAY EXTREME ATTENTION TO DATES AND TIMELINES. DO NOT MISS ANY DATES,TIMELINES OR ALTER THEM.
    - PRESERVE ALL RELATIVE TIME REFERENCES EXACTLY AS THEY APPEAR IN THE ORIGINAL TEXT. For example, "this year", "next month", "last week", "recent", "upcoming", etc. MUST remain unchanged in your summary.
    - NEVER replace relative dates with absolute dates or years from your training data.
    - If you encounter phrases like "this summer", "last quarter", or any similar time reference, use the EXACT SAME WORDING in your summary.
    - If the documents are not clear or ambiguous about a certain point, do not attempt to clarify or expand - instead, maintain the same level of ambiguity in your writing.
    - If information seems missing or incomplete in the documents, do not fill in gaps with your own knowledge.
    - Keep the same tone as the original source document.
    - If the document has relative dates, do not substitute them with absolute dates. Instead, maintain the original relative reference or indicate uncertainty about the precise date.
    - If the provided documents are in Portuguese from Portugal, write the summary in Portuguese from Portugal. If the documents are in English, write the summary in English.
    - Keep the summary to 200 words or less.
    - Generate a list of key topics that are present in the document.
    - The list of key topics should be a list of strings.
    - The list of key topics should be in the same language as the document.
    - The list of key topics should consist at most 5 topics. 
    - The list of key topics should be in the same order as the topics are presented in the document.
    - The list of key topics should be concise and to the point, covering the key points and main ideas of the documents.
    The summary should be concise and to the point, covering the key points and main ideas of the documents.
    `;

  const USER_PROMPT = `
   Summarize the following text with extreme attention to dates and timelines.
Double-check any years or dates you mention.
IMPORTANT: Keep all relative dates (like "this year", "next month", "recent", etc.) EXACTLY as they appear in the original text. DO NOT convert them to absolute dates.
    ${content}
    `;

  const EXAMPLE_DOCUMENT = `DolphinGemma will get its first test run this summer.
      Dolphins are generally regarded as some of the smartest creatures on the planet. Research has shown they can cooperate, teach each other new skills, and even recognize themselves in a mirror. For decades, scientists have attempted to make sense of the complex collection of whistles and clicks dolphins use to communicate. Researchers might make a little headway on that front soon with the help of Google's open AI model and some Pixel phones.Google has been finding ways to work generative AI into everything else it does, so why not its collaboration with the Wild Dolphin Project (WDP)? This group has been studying dolphins since 1985 using a non-invasive approach to track a specific community of Atlantic spotted dolphins. The WDP creates video and audio recordings of dolphins, along with correlating notes on their behaviors.One of the WDP's main goals is to analyze the way dolphins vocalize and how that can affect their social interactions. With decades of underwater recordings, researchers have managed to connect some basic activities to specific sounds. For example, Atlantic spotted dolphins have signature whistles that appear to be used like names, allowing two specific individuals to find each other. They also consistently produce "squawk" sound patterns during fights.WDP researchers believe that understanding the structure and patterns of dolphin vocalizations is necessary to determine if their communication rises to the level of a language. "We do not know if animals have words," says WDP's Denise Herzing.The ultimate goal is to speak dolphin, if indeed there is such a language. The pursuit of this goal has led WDP to create a massive, meticulously labeled data set, which Google says is perfect for analysis with generative AI.The large language models (LLMs) that have become unavoidable in consumer tech are essentially predicting patterns. You provide them with an input, and the models predict the next token over and over until they have an output. When a model has been trained effectively, that output can sound like it was created by a person. Google and WDP hope it's possible to do something similar with DolphinGemma for marine mammals.DolphinGemma is based on Google's Gemma open AI models, which are themselves built on the same foundation as the company's commercial Gemini models. The dolphin communication model uses a Google-developed audio technology called SoundStream to tokenize dolphin vocalizations, allowing the sounds to be fed into the model as they're recorded.Google says it trained the model using the Wild Dolphin Project's acoustic archive. It's an audio-in, audio-out model. So after providing it with a dolphin vocalization, the model does just what human-centric language models do—it predicts the next token. If it works anything like a standard LLM, those predicted tokens could be sounds that a dolphin would understand.The team hopes that DolphinGemma will help tease out complex patterns that will allow for the creation of a shared vocabulary. Having humans examine the data in this way would be prohibitively time-consuming, Google claims.Google says it designed DolphinGemma with WDP's research approach in mind. The team uses Pixel phones in the field, so the model had to be efficient. Running AI models on a smartphone is often challenging because of constrained resources. The larger and more capable a model is, the more RAM and processing throughput it needs to operate. DolphinGemma consists of about 400 million parameters. That's on the small side for a typical LLM.Since the team observes wild dolphins in underwater environments, they need compact audio systems. For the last several years, WDP has been using a device created at the Georgia Institute of Technology called CHAT (Cetacean Hearing Augmentation Telemetry) based on the Pixel 6. The team uses CHAT to create synthetic dolphin vocalizations that they attempt to associate with an object. It can also listen to dolphin sounds for a matching "mimic" reply.Google says the team will have a new Pixel 9-based CHAT for the 2025 summer research season. Moving to the Pixel 9 will reportedly allow CHAT to run deep learning models and template-matching algorithms at the same time. The team does not appear to be interested in piping DolphinGemma's output right into the CHAT audio transducer for the animals to hear. The work with CHAT could benefit from Google's AI work, but it's a parallel area of investigation.No one is expecting DolphinGemma and the new CHAT to immediately make humans conversant in dolphin whistles, but the system could enable basic interactions in time.Like the human-language Gemma models, DolphinGemma is an open access project. Google will release the model for researchers around the world to use this summer. While DolphinGemma has been trained on Atlantic spotted dolphin sounds, Google suggests it should be feasible to fine-tune it for other cetacean species.Ars Technica has been separating the signal from
          the noise for over 25 years. With our unique combination of
          technical savvy and wide-ranging interest in the technological arts
          and sciences, Ars is the trusted source in a sea of information. After
          all, you don't need to know everything, only what's important.`;

  const EXAMPLE_SUMMARY = `Google and the Wild Dolphin Project (WDP) have developed DolphinGemma, an AI model based on Google's Gemma architecture, to help decode dolphin communication. Trained on decades of audio data from WDP's non-invasive research on Atlantic spotted dolphins, the model uses Google's SoundStream technology to tokenize dolphin sounds, allowing it to predict sequences of vocalizations—similar to how language models process human speech. The goal is to identify patterns that could indicate a dolphin "vocabulary" and ultimately support basic interspecies communication. Designed to run efficiently on smartphones like Pixel devices, DolphinGemma will be deployed during the 2025 summer research season alongside an upgraded version of the CHAT (Cetacean Hearing Augmentation Telemetry) device. While DolphinGemma and CHAT operate in parallel, both aim to deepen understanding of dolphin communication. The model will be open-sourced and may be adapted for other marine species in future studies.`;

  const EXAMPLE_TOPICS = [
    "Dolphin communication research",
    "Google's DolphinGemma AI model",
    "Wild Dolphin Project dataset",
    "Audio technology and modeling",
    "Future research and device upgrades",
  ];
  const ASSISTANT_PROMPT = `
    Here is an example of a summary and list of key topics based on the following document:

    Document Example: 
    ${EXAMPLE_DOCUMENT}

    Summary Example: 
    ${EXAMPLE_SUMMARY}

    Key Topics Example:
${EXAMPLE_TOPICS}
    `;

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: USER_PROMPT },
    { role: "assistant", content: ASSISTANT_PROMPT },
  ];

  const result = await generateObject({
    model: openai("gpt-4.1-nano"),
    messages,
    schema: DocummentSummarySchema,
    maxTokens: 400,
    temperature: 0.1,
  });

  return result.object;
}
