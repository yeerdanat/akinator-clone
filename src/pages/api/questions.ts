// src/pages/api/questions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { OpenAI } from "openai";
import { sessions } from "../../lib/sessionStore";

interface QuestionResponse {
  sessionId: string;
  question: string;
}

// .env.local:
// GROQ_API_KEY=gsk_…
// GROQ_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

const systemPrompt = `You are Akinator, a genie that guesses characters by asking yes/no/don't know questions.
After each answer, ask exactly one next question or, if confident enough, make a guess.
Respond with ONLY valid JSON (no explanations, no markdown fences):
{"question":"..."} or {"guess":"..."}.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuestionResponse>
) {
  const sessionId = uuidv4();
  const history = [{ role: "system", content: systemPrompt }];

  let assistant;
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.GROQ_MODEL!,
      messages: history,
      temperature: 0,
    });
    assistant = completion.choices[0].message!;
  } catch (error: any) {
    console.error("Groq error (questions):", error);
    return res
      .status(500)
      .json({ sessionId, question: "Error contacting Groq Cloud." });
  }

  sessions[sessionId] = [
    ...history,
    { role: assistant.role, content: assistant.content },
  ];

  let raw = assistant.content.trim();
  if (raw.startsWith("```"))
    raw = raw
      .replace(/^```(?:json)?\s*/, "")
      .replace(/```$/, "")
      .trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  const jsonStr =
    start !== -1 && end !== -1 ? raw.substring(start, end + 1) : raw;

  try {
    const parsed = JSON.parse(jsonStr);
    return res.status(200).json({ sessionId, question: parsed.question });
  } catch (err) {
    console.error("Parse error (questions):", raw);
    return res
      .status(500)
      .json({ sessionId, question: "Invalid Groq response format." });
  }
}
