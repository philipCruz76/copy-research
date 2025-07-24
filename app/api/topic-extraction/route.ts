import { NextResponse } from "next/server";
import { generateText, generateId, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import db from "@/app/lib/db";
import { Conversation } from "@prisma/client";
import { auth } from "@/app/lib/auth";

export async function POST(req: Request) {
  const { messages, id }: { messages: UIMessage[]; id: string } =
    await req.json();

  try {
    /**   FUTURE IMPLEMENTATION
       * // 1. Extract embeddings from messages
    const texts = messages.map((message: ChatMessage) => message.content);
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
    const session = await auth();
    // const modelMessages = convertToModelMessages(messages);
    // 4. Summarize the overall topic
    const conversationText = messages
      .map(
        (m: UIMessage) =>
          `${m.role}: ${m.parts.map((p: any) => p.text).join(" ")}`,
      )
      .join("\n");
    const summaryResponse = await generateText({
      model: openai("gpt-4.1-nano"),
      messages: [
        {
          role: "system",
          content: `Summarize the main topic of this conversation in 4 words or less that will be used as a headline. 
            IMPORTANT- NOTES:
            1- The topic should be 4 words or less and a sentence, not a question!
            2- The topic should be in concise and to the point.
            `,
        },
        { role: "user", content: conversationText },
      ],
      maxOutputTokens: 50,
      temperature: 0.1,
    });

    const mainTopic = summaryResponse.text.trim();

    // 5. Update the conversation title in the database
    let conversation: Conversation | null = null;
    if (!id) {
      conversation = await db.conversation.create({
        data: {
          id: generateId(),
          title: mainTopic,
          userId: session?.user.id!,
        },
      });
    } else {
      // Check if conversation exists, create it if it doesn't
      conversation = await db.conversation.findUnique({
        where: { id },
      });

      if (!conversation) {
        conversation = await db.conversation.create({
          data: {
            id,
            title: mainTopic,
            userId: session?.user.id!,
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
