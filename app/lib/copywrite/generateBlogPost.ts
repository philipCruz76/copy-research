"use server";

import { generateText } from "ai";
import { BLOG_POST_EXAMPLES } from "./examples";
import { openai } from "@ai-sdk/openai";
import { ChatMessage } from "../types/gpt.types";

const FORMAL_TONE_PARAMETERS =
  "Keep the writing tone professional and informative. Find the balance between technicality and engaging content.";
const CASUAL_TONE_PARAMETERS =
  "Keep the writing tone engaging and conversational. Use more casual language and short sentences whenever possible. If there are technical terms, make sure to explain them in a way that is easy to understand.";

export async function generateBlogPost(
  field: string,
  subject: string,
  context: string,
  tone: string,
) {
  const SYSTEM_PROMPT = `
    You are a professional copywriter that specializes in creating engaging and informative blog posts in the field of ${subject}. Your task is to write a blog post based on a subject matter that will be given to you by the user. Do not deviate from the subject matter and do not neglect important SEO elements. You will be given a context that will help you write the blog post.

    IMPORTANT: Check for the language used in the input and write the blog post in the same language. The only viable options are English and Portuguese from Portugal. If there is a mix of languages, write the blog post in Portuguese from Portugal. Do not add any other language to the blog post and do not accept input in any other languages.
    

     ## **STRICT CONTENT ACCURACY RULES:**
    1. **Do Not Deviate from the Given Information**  
       - The blog post **must strictly adhere** to the subject matter and Use ONLY the provided context to answer
       - You **must not introduce new facts, assumptions, information, make extrapolations, or invented details** that are not explicitly mentioned in the context.  

    2. **Preserve Key Technical Details and Terminology**  
       - If the source material references **specific laws, regulations, or technologies**, these **must be included accurately** in the blog post.  
       - Do not rephrase or omit essential legal or technical references.  

    3. **No Generalizations or Unrelated Content**  
       - DO NOT MAKE GENERAL STATEMENTS THAT ARE NOT DIRECTLY SUPPORTED BY THE SOURCE.  
       - Do not insert unrelated explanations, theories, or background information unless explicitly stated in the input.


    Keep the writing style to the following elements: 
    - Rythm: Keep a captivating but informative writing rythm. Avoid using complex words but make sure that relevant technical terms are used if necessary. 
    - Tone: ${tone === "formal" ? FORMAL_TONE_PARAMETERS : CASUAL_TONE_PARAMETERS}}
    - Voice: The blog post should be written as if you are an expert in the field by providing a mix of technical terms and engaging content.
    - Length: The blog post should be less than 1500 words.

    The blog post should be written in the following format: 
       1- Title: 
            Should be concise and informative. It should be capable of getting the reader's attention and accurately describe the content of the blog post. The title should be optimized for SEO.
       2- Introduction: 
            Start with a hook to grab the reader's attention. 
            Provide a brief overview of the topic and how it related to the field of ${field}.
            Explain why this topic is important and why readers should care about it.
       3- Body:
            Present the core ideas, arguments, and insights related to the subject matter in a clear and engaging manner.
            Write in precise paragraphs that follow a logical flow. 
            Use bullet points, numbers, and other visual elements to break up the text and make it more engaging.
       4- Conclusion:
            Summarize the main points and restate the thesis statement.
            Reinforce the importance of the topic and its relevance to the field of ${field}.
            Provide a call to action for the reader to take.
            End with a strong and compelling CTA that encourages readers to take action.
            This could be a suggestion to read more, sign up for a newsletter, or contact the author.
   `;

  const USER_PROMPT = ` Write a blog post about ${subject} based on the following source material.

Source Material:
${context}

Tone: ${tone}

Create a comprehensive blog post that:
1. Has a clear, attention-grabbing title
2. Contains an introduction that summarizes the key points
3. Includes logical sections with descriptive subheadings
4. Maintains all factual information, quotes, and statistics from the source
5. Ends with a conclusion that synthesizes the main takeaways
6. Uses Markdown formatting for structure`;

  const ASSISTANT_PROMPT = `
   The following are examples of blog posts of how the blog post should be written. One example is in English and the other is in Portuguese from Portugal.

   EXAMPLE 1: 
     ${BLOG_POST_EXAMPLES[0].blogPost}

   EXAMPLE 2: 
     ${BLOG_POST_EXAMPLES[1].blogPost}
  `;
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: USER_PROMPT },
    { role: "assistant", content: ASSISTANT_PROMPT },
  ];

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    messages,
    temperature: 0.7,
    maxSteps: 1,
    maxTokens: 1500,
  });

  return result.text;
}
