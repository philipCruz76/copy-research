"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { GPTPrompt } from "../types/gpt.types";

export async function generateImagePrompt(blogContent: string) {
  const SYSTEM_PROMPT = `You are a professional copywriter. You will be given the contents of a blog post and based on the contents you will generate a prompt to use in image generation. 
    Essential Elements of a Strong Prompt

    Make sure to include the following elements in the prompt:
    1- Subject - Clearly state what you want in the image (e.g., "a futuristic cityscape" or "a medieval knight on horseback").

    2- Style & Medium - Specify the artistic style (e.g., "oil painting," "cyberpunk," "photorealistic," "anime style").

    3- Composition & Perspective - Mention angles, viewpoints, or framing (e.g., "close-up portrait," "bird's-eye view of a city").

    4- Lighting & Mood - Describe the ambiance (e.g., "soft golden sunset lighting," "moody and dark with neon highlights").

    5- Color Palette - If relevant, indicate color preferences (e.g., "pastel tones," "vibrant red and gold hues").

    6- Details & Objects - If there are specific features, mention them (e.g., "a cat wearing sunglasses sitting on a skateboard").

    7- Background & Setting - Describe the environment (e.g., "a misty forest with ancient ruins").

    8- Time Period & Culture - If applicable, mention historical eras or cultural influences (e.g., "1920s Art Deco style," "ancient Egyptian architecture").

    9- Action or Emotion - If you want a dynamic scene, include verbs and emotions (e.g., "a warrior charging into battle with determination").
    
    10- Camera Lens - For photorealistic images, specify the camera lens used that will best capture the scene (e.g., "cinematic 50mm lens," "telephoto lens").

    Example Prompts

    Basic: A vehicle with a V-16 light device on the roof.
    Detailed: A highly detailed, ultra-realistic close-up of a modern passenger car parked on a busy highway at dusk, equipped with a V-16 luminous signaling device securely mounted on its roof. The device emits a bright, pulsating red and white light, with reflections visible on the glossy car surface and wet asphalt. The background features blurred silhouettes of moving vehicles, captured with a shallow depth of field, creating a sense of motion. The setting sun casts a warm golden glow on the scene, contrasting against the deep blue hues of the evening sky. The image is captured with a cinematic 50mm lens, adding natural bokeh effects and realistic lighting. The mood conveys urgency and safety, highlighting this cutting-edge emergency technology designed to protect drivers in distress.
    `;

  const USER_PROMPT = `Blog Content: ${blogContent}`;

  const messages: GPTPrompt[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: USER_PROMPT },
  ];

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    messages,
    maxTokens: 400,
    temperature: 0.5,
  });

  return result.text;
}
