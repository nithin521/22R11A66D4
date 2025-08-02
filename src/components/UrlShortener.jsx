import { useState, useRef } from "react";
import { logEvent } from "../middleware/logger";
import {
  isValid,
  isValidShortcode,
  generateShorterner,
} from "../utils/validation";

const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [validity, setValidity] = useState(""); // blank means default
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const urlInput = useRef();
  const urls = {};

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValid(url)) {
      setError(
        "Please enter a valid URL (must start with http:// or https://)"
      );
      logEvent(
        "urlshortener",
        "warn",
        "frontend",
        `Invalid URL submitted: ${url}`
      );
      urlInput.current.focus();
      return;
    }
    if (shortcode && !isValidShortcode(shortcode)) {
      setError(
        "Shortcode must be 3-20 chars, alphanumeric, dash or underscore"
      );
      logEvent(
        "urlshortener",
        "warn",
        "frontend",
        `Invalid shortcode submitted: ${shortcode}`
      );
      return;
    }
    let validityMinutes = 30;
    if (validity !== "") {
      if (!Number.isFinite(+validity) || +validity <= 0) {
        setError("Validity must be a positive integer (minutes)");
        logEvent(
          "urlshortener",
          "warn",
          "frontend",
          `Invalid validity submitted: ${validity}`
        );
        return;
      }
      validityMinutes = parseInt(validity, 10);
    }

    let code = shortcode || generateShorterner();
    if (urls[code]) {
      setError(
        "Shortcode already exists. Choose another or leave blank for auto."
      );
      logEvent(
        "urlshortener",
        "warn",
        "frontend",
        `Shortcode collision: ${code}`
      );
      return;
    }

    const expiresAt = Date.now() + validityMinutes * 60 * 1000;
    urls[code] = { url, expiresAt };
    setSuccess(`Short URL created: ${window.location.origin}/${code}`);
    logEvent(
      "urlshortener",
      "info",
      "frontend",
      `Short URL created: ${code} -> ${url} (expires at ${expiresAt})`
    );
    setShortcode("");
    setUrl("");
    setValidity("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2> Custom URL Shortener</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Long URL:</label>
        <input
          ref={urlInput}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          style={{ width: "100%" }}
          required
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Custom Shortcode (optional):</label>
        <input
          type="text"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
          placeholder="e.g. my-link"
          style={{ width: "100%" }}
        />
        <small>Leave blank for auto-generated code</small>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Validity (minutes):</label>
        <input
          type="number"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
          min={1}
          style={{ width: 80 }}
        />
        <small style={{ marginLeft: 8 }}>(Default: 30 min)</small>
      </div>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {success && (
        <div style={{ color: "green", marginBottom: 8 }}>{success}</div>
      )}
      <button
        type="submit"
        style={{ width: "100%", padding: 10, fontWeight: 600 }}
      >
        Shorten URL
      </button>
    </form>
  );
};

export default UrlShortener;
