import Layout from "../components/Layout";
import { useState, useEffect, CSSProperties } from "react";

interface QuestionResponse {
  sessionId: string;
  question: string;
}
interface StepResponse {
  question?: string;
  guess?: string;
}

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "3rem",
};
const questionBox: CSSProperties = {
  background: "rgba(0,0,0,0.7)",
  color: "#fff",
  padding: "1.5rem 2rem",
  borderRadius: "8px",
  maxWidth: "600px",
  textAlign: "center",
  fontSize: "1.25rem",
  minHeight: "80px",
};
const buttonsRow: CSSProperties = {
  display: "flex",
  gap: "1rem",
  marginTop: "1.5rem",
};
const btnAnswer: CSSProperties = {
  padding: "0.75rem 1.5rem",
  background: "#ffd700",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "1rem",
  color: "#333",
  minWidth: "100px",
};

export default function Play() {
  const [question, setQuestion] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data: QuestionResponse) => {
        setSessionId(data.sessionId);
        setQuestion(data.question);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAnswer = (ans: "yes" | "no" | "idk") => {
    if (!sessionId) return;
    setLoading(true);
    fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, answer: ans }),
    })
      .then((res) => res.json())
      .then((data: StepResponse) => {
        if (data.question) {
          setQuestion(data.question);
        } else if (data.guess) {
          setQuestion(`I guess: ${data.guess}`);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <Layout>
      <div style={containerStyle}>
        <div style={questionBox}>{loading ? "Loading..." : question}</div>
        <div style={buttonsRow}>
          <button
            style={btnAnswer}
            onClick={() => handleAnswer("yes")}
            disabled={loading}
          >
            Yes
          </button>
          <button
            style={btnAnswer}
            onClick={() => handleAnswer("no")}
            disabled={loading}
          >
            No
          </button>
          <button
            style={btnAnswer}
            onClick={() => handleAnswer("idk")}
            disabled={loading}
          >
            Don't know
          </button>
        </div>
      </div>
    </Layout>
  );
}
