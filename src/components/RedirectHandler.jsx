import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { logEvent } from "../middleware/logger";

const RedirectHandler = () => {
  const { code } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    let urls = {};
    try {
      urls = JSON.parse(localStorage.getItem("urls")) || {};
    } catch {
      urls = {};
    }
    const entry = urls[code];
    if (!entry) {
      setError("Shortcode not found.");
      logEvent(
        "urlshortener",
        "warn",
        "frontend",
        `Redirect failed: shortcode not found: ${code}`
      );
      return;
    }
    if (Date.now() > entry.expiresAt) {
      setError("This short URL has expired.");
      logEvent(
        "urlshortener",
        "warn",
        "frontend",
        `Redirect failed: expired: ${code}`
      );
      return;
    }
    logEvent(
      "urlshortener",
      "info",
      "frontend",
      `Redirecting: ${code} -> ${entry.url}`
    );
    window.location.href = entry.url;
  }, [code]);

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>
        {error}
      </div>
    );
  }
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>Redirecting...</div>
  );
};

export default RedirectHandler;
