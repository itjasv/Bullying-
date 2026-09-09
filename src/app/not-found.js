import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "var(--navbar-height)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 400, padding: "0 var(--space-6)" }}>
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 28,
            fontWeight: 600,
            color: "var(--primary)",
            opacity: 0.45,
            marginBottom: 4,
          }}>
            lost?
          </p>
          <h1 style={{
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            marginBottom: 12,
          }}>
            404
          </h1>
          <p style={{
            fontSize: 15,
            color: "var(--text-mid)",
            lineHeight: "24px",
            marginBottom: 24,
          }}>
            This page does not exist. If you were looking for a report, use the tracking page instead.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
            <Link href="/" className="btn btn-primary">Go Home</Link>
            <Link href="/track" className="btn btn-secondary">Track a Report</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
