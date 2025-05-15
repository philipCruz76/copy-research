import { ChatMessage } from "@/app/lib/types/gpt.types";
import { agnes } from "ml-hclust";
import { NextResponse } from "next/server";
import { embeddings } from "@/app/lib/ai/gpt";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import db from "@/app/lib/db";

export async function POST(req: Request) {
  const { messages, id } = await req.json();

  try {
    // 1. Extract embeddings from messages
    const texts = messages.map((message: ChatMessage) => message.content);

    {
      /**   FUTURE IMPLEMENTATION
    const textEmbeddings = await embeddings.embedQuery(texts.join("\n"));
   
    
    // 2. Agglomerative clustering (optional - group by topics)
    const clustering = agnes(textEmbeddings, {
      method: "average",
      isDistanceMatrix: false,
    });

    // 3. Optional: extract clusters with a cutoff (e.g., 0.6)
    function extractClusters(node: any, threshold: number): number[][] {
      if (node.height <= threshold || !node.children) return [node.indexes];
      return node.children.flatMap((child: any) =>
        extractClusters(child, threshold),
      );
    }

   // const clusters = extractClusters(clustering, 0.4);
  */
    }

    // 4. Summarize the overall topic
    const conversationText = messages
      .map((m: ChatMessage) => `${m.role}: ${m.content}`)
      .join("\n");
    const summaryResponse = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: `Summarize the main topic of this conversation in 5 words or less that will be used as a headline. 
            IMPORTANT- NOTES:
            1- The topic should be 5 words or less. and a sentence, not a question!
            2- The topic should be in the style of an article headline.
            `,
        },
        { role: "user", content: conversationText },
      ],
      maxTokens: 50,
    });

    const mainTopic = summaryResponse.text.trim();

    // 5. Update the conversation title in the database

    // Check if conversation exists, create it if it doesn't
    let conversation = await db.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          id,
          title: mainTopic,
        },
      });
    } else {
      conversation = await db.conversation.update({
        where: { id },
        data: {
          title: mainTopic,
        },
      });
    }

    // 6. Return the main topic and clusters
    return NextResponse.json({
      mainTopic,
      conversation,
    });
  } catch (error: any) {
    console.error("Topic detection error:", error);
    return new NextResponse("Topic detection failed.", { status: 500 });
  }
}
