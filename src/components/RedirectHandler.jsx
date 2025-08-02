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
    const recordClickAndRedirect = async () => {
      let location = {};
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          location = await res.json();
        }
      } catch {}
      const click = {
        timestamp: Date.now(),
        referrer: document.referrer,
        city: location.city || "",
        country: location.country_name || "",
      };
      let urlClicks = {};
      try {
        urlClicks = JSON.parse(localStorage.getItem("urlClicks")) || {};
      } catch {
        urlClicks = {};
      }
      if (!urlClicks[code]) urlClicks[code] = [];
      urlClicks[code].push(click);
      localStorage.setItem("urlClicks", JSON.stringify(urlClicks));
      logEvent(
        "urlshortener",
        "info",
        "frontend",
        `Redirecting: ${code} -> ${entry.url} (click recorded)`
      );
      window.location.href = entry.url;
    };

    recordClickAndRedirect();
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
