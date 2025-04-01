import { parseSubjectMatter } from "@/app/lib/copywrite/parseSubjectMatter";

export async function POST(req: Request) {
  const { topic, keywords, tone } = await req.json();

  const subjectMatter = await parseSubjectMatter(topic);
}
