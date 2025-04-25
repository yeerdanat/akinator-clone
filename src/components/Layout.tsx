import Link from "next/link";
import { ReactNode, CSSProperties } from "react";

interface LayoutProps {
  children: ReactNode;
}

// fullscreen background container
const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundImage: 'url("/images/akin-bg.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
};
const headerStyle: CSSProperties = {
  background: "rgba(0,0,0,0.6)",
  padding: "16px",
};
const navStyle: CSSProperties = { display: "flex", gap: "16px" };
const linkStyle: CSSProperties = {
  color: "#ffd700",
  textDecoration: "none",
  fontWeight: "bold",
};
const mainStyle: CSSProperties = { flex: 1, padding: "32px" };
const footerStyle: CSSProperties = {
  textAlign: "center",
  padding: "16px",
  background: "rgba(0,0,0,0.6)",
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <nav style={navStyle}>
          <Link href="/" style={linkStyle}>
            Home
          </Link>
          <Link href="/play" style={linkStyle}>
            Play
          </Link>
        </nav>
      </header>
      <main style={mainStyle}>{children}</main>
      <footer style={footerStyle}>© Yerdanat Kurmantayev</footer>
    </div>
  );
}
