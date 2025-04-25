// FILE: src/pages/api/answer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import { sessions } from "../../lib/sessionStore";

interface StepResponse {
  question?: string;
  guess?: string;
}

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StepResponse>
) {
  const { sessionId, answer } = req.body as {
    sessionId: string;
    answer: "yes" | "no" | "idk";
  };

  const history = sessions[sessionId];
  if (!history) {
    return res
      .status(400)
      .json({ question: "Session not found. Please restart." });
  }

  history.push({ role: "user", content: answer });

  let assistant;
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.GROQ_MODEL!,
      messages: history,
      temperature: 0,
    });
    assistant = completion.choices[0].message!;
  } catch (error: any) {
    console.error("Groq error (answer):", error);
    return res.status(500).json({ question: "Error contacting Groq Cloud." });
  }

  history.push({ role: assistant.role, content: assistant.content });

  let raw = assistant.content.trim();
  if (raw.startsWith("```")) {
    raw = raw
      .replace(/^```(?:json)?\s*/, "")
      .replace(/```$/, "")
      .trim();
  }
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  const jsonStr =
    start !== -1 && end !== -1 ? raw.substring(start, end + 1) : raw;

  try {
    const parsed = JSON.parse(jsonStr);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Parse error (answer):", raw);
    return res.status(500).json({ question: "Invalid Groq response format." });
  }
}
