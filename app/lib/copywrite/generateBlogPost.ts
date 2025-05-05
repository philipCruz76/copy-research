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
  title: string,
  topic: string,
  style: string,
  audience: string | null | undefined,
  keywords: string[] | null | undefined,
  context: string,
) {
  const tone = style || "formal";
  const audienceString = audience
    ? `The blog post should be written for ${audience}.`
    : "";
  const keywordsString =
    keywords && keywords.length > 0
      ? `The blog post should include the following keywords: ${keywords.join(", ")}.`
      : "";

  const SYSTEM_PROMPT = `
    You are a professional copywriter that specializes in creating engaging and informative blog posts. Your task is to write a blog post about ${topic} with the title "${title}". ${audienceString} ${keywordsString} Do not deviate from the subject matter and do not neglect important SEO elements. You will be given a context that will help you write the blog post.

    IMPORTANT: Check for the language used in the input and write the blog post in the same language. The only viable options are English and Portuguese from Portugal. If there is a mix of languages, write the blog post in Portuguese from Portugal. Do not add any other language to the blog post and do not accept input in any other languages.
    

     ## **STRICT CONTENT ACCURACY RULES:**
    1. **Do Not Deviate from the Given Information**  
       - The blog post **must strictly adhere** to the topic and Use ONLY the provided context to answer
       - You **must not introduce new facts, assumptions, information, make extrapolations, or invented details** that are not explicitly mentioned in the context.  
       - If there is any content related to research done about the subject, you must include it in the blog post.
       - When paraphrasing, ensure you maintain the exact meaning and implications of the original content.
       - **CRITICAL**: Do not add ANY information not found in the source context, even if it seems like common knowledge or would make the article more engaging.

    2. **Preserve Key Technical Details and Terminology**  
       - If the source material references **specific laws, regulations, or technologies**, these **must be included accurately** in the blog post.  
       - Do not rephrase or omit essential legal or technical references.
       - Use direct quotes when appropriate to maintain absolute accuracy.  

    3. **No Generalizations or Unrelated Content**  
       - DO NOT MAKE GENERAL STATEMENTS THAT ARE NOT DIRECTLY SUPPORTED BY THE SOURCE.  
       - Do not insert unrelated explanations, theories, or background information unless explicitly stated in the input.
       - Do not expand on points, concepts, or ideas beyond what is directly stated in the source context.

    4. **Accuracy Verification Steps**
       - After drafting each section, review it against the source context to verify all information is present and accurate.
       - If the source is unclear or ambiguous about a certain point, do not attempt to clarify or expand - instead, maintain the same level of ambiguity in your writing.
       - If information seems missing or incomplete in the source, do not fill in gaps with your own knowledge.


    Keep the writing style to the following elements: 
    - Rythm: Keep a captivating but informative writing rythm. Avoid using complex words but make sure that relevant technical terms are used if necessary. 
    - Tone: ${tone === "formal" ? FORMAL_TONE_PARAMETERS : CASUAL_TONE_PARAMETERS}
    - Voice: The blog post should be written as if you are an expert in the field by providing a mix of technical terms and engaging content.
    - Length: The blog post should be less than 1500 words.

    The blog post should be written in the following format: 
       1- Title: 
            Use the provided title "${title}" as the main title. If needed, you can add a subtitle.
       2- Introduction: 
            Start with a hook to grab the reader's attention. 
            Provide a brief overview of the topic.
            Explain why this topic is important and why readers should care about it.
            Only use information explicitly stated in the context.
       3- Body:
            Present the core ideas, arguments, and insights related to the subject matter in a clear and engaging manner.
            Write in precise paragraphs that follow a logical flow. 
            Use bullet points, numbers, and other visual elements to break up the text and make it more engaging.
            Include all the keywords provided if possible: ${keywords && keywords.length > 0 ? keywords.join(", ") : "No specific keywords provided"}.
            Ensure every fact or claim is directly supported by the source material.
       4- Conclusion:
            Summarize the main points and restate the thesis statement.
            Reinforce the importance of the topic.
            Provide a call to action for the reader to take.
            End with a strong and compelling CTA that encourages readers to take action.
            This could be a suggestion to read more, sign up for a newsletter, or contact the author.
            Do not introduce new information in the conclusion.
   `;

  const USER_PROMPT = `
    Write a blog post about ${topic} with the title "${title}" based on the following source material.

    Source Material:
    ${context}

    Tone: ${tone}
    Target Audience: ${audience || "General audience"}
    Keywords to include: ${keywords && keywords.length > 0 ? keywords.join(", ") : "No specific keywords required"}

    Create a comprehensive blog post that:
    1. Uses the provided title "${title}"
    2. Contains an introduction that summarizes ONLY the key points present in the source material
    3. Includes logical sections with descriptive subheadings
    4. Maintains all factual information, quotes, and statistics from the source with absolute accuracy
    5. Incorporates the provided keywords naturally throughout the content where appropriate
    6. Ends with a conclusion that synthesizes the main takeaways without adding new information
    7. Uses Markdown formatting for structure
    8. CRITICAL: Do not add ANY information, context, or explanations that are not explicitly present in the source material
    9. If the source material lacks detail on a particular aspect, acknowledge the limitation rather than filling in gaps
  `;

  const ASSISTANT_PROMPT = `
   The following are examples of blog posts of how the blog post should be written. One example is in English and the other is in Portuguese from Portugal.

   EXAMPLE 1: 
     ${BLOG_POST_EXAMPLES[0].blogPost}

   EXAMPLE 2: 
     ${BLOG_POST_EXAMPLES[1].blogPost}
     
   IMPORTANT ACCURACY VERIFICATION: Before submitting your final response, review your entire blog post and check that:
   1. Every single fact or claim is directly traceable to the source material
   2. No additional information, context, or explanations have been added
   3. Technical terms, names, dates, numbers, and statistics match exactly with the source
   4. You've maintained the same level of uncertainty or certainty as expressed in the source
   5. Any ambiguities or gaps in the source material remain acknowledged rather than filled with assumptions
  `;
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: USER_PROMPT },
    { role: "assistant", content: ASSISTANT_PROMPT },
  ];

  const result = await generateText({
    model: openai("gpt-4.1-nano"),
    messages,
    temperature: 0.3,
    maxSteps: 1,
    maxTokens: 1500,
  });

  return result.text;
}
