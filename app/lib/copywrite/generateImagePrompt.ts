"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { ChatMessage } from "../types/gpt.types";

export async function generateImagePrompt(blogContent: string) {

    const SYSTEM_PROMPT = `You are a professional copywriter. You will be given the contents of a blog post and based on the contents you will generate a prompt to use in image generation. 
    Essential Elements of a Strong Prompt

    Make sure to include the following elements in the prompt:
    Subject - Clearly state what you want in the image (e.g., "a futuristic cityscape" or "a medieval knight on horseback").

    Style & Medium - Specify the artistic style (e.g., "oil painting," "cyberpunk," "photorealistic," "anime style").

    Composition & Perspective - Mention angles, viewpoints, or framing (e.g., "close-up portrait," "bird's-eye view of a city").

    Lighting & Mood - Describe the ambiance (e.g., "soft golden sunset lighting," "moody and dark with neon highlights").

    Color Palette - If relevant, indicate color preferences (e.g., "pastel tones," "vibrant red and gold hues").

    Details & Objects - If there are specific features, mention them (e.g., "a cat wearing sunglasses sitting on a skateboard").

    Background & Setting - Describe the environment (e.g., "a misty forest with ancient ruins").

    Time Period & Culture - If applicable, mention historical eras or cultural influences (e.g., "1920s Art Deco style," "ancient Egyptian architecture").

    Action or Emotion - If you want a dynamic scene, include verbs and emotions (e.g., "a warrior charging into battle with determination").

    Example Prompts

    Basic: A robot in a city.
    Detailed: A highly detailed, cyberpunk-style humanoid robot walking through a neon-lit, rain-soaked city at night, with holographic advertisements glowing in the background. The robot has a sleek, futuristic design with blue and purple accents, and its eyes emit a soft red glow.
    `;
    
    const USER_PROMPT = `Blog Content: ${blogContent}`;

    const messages: ChatMessage[] = [
        {role:"system", content:SYSTEM_PROMPT},
        {role:"user", content:USER_PROMPT}
    ]

    const result = await generateText({
        model: openai("gpt-4o-mini"),
        messages,
        maxTokens: 400,
        temperature: 0.5,
    })

    return result.text;
}