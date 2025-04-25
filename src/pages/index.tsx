import Layout from "../components/Layout";
import Link from "next/link";
import { CSSProperties } from "react";

const heroStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "4rem",
};
const heroText: CSSProperties = { maxWidth: "50%" };
const titleStyle: CSSProperties = {
  fontSize: "3rem",
  marginBottom: "1rem",
  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
};
const descStyle: CSSProperties = {
  fontSize: "1.25rem",
  marginBottom: "1.5rem",
};
const btnStyle: CSSProperties = {
  padding: "0.75rem 1.5rem",
  background: "#ffd700",
  color: "#333",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "1rem",
};
const heroImage: CSSProperties = {
  maxWidth: "40%",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
};

export default function Home() {
  return (
    <Layout>
      <div style={heroStyle}>
        <div style={heroText}>
          <h1 style={titleStyle}>Akinator Clone</h1>
          <p style={descStyle}>
            Guess any character and our genie will guess it!
          </p>
          <Link href="/play">
            <button style={btnStyle}>Play Now</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
