import { useState, useRef } from "react";
import { logEvent } from "../middleware/logger";
import { isValid } from "../utils/isValid";
import { isValidShortcode } from "../utils/isValidShortcode";
import { generateShorterner } from "../utils/generateShortener";
import "./UrlShortener.css";

const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [validity, setValidity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const urlInput = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    let urls = {};
    try {
      urls = JSON.parse(localStorage.getItem("urls")) || {};
    } catch {
      urls = {};
    }

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

    let code = shortcode || generateShorterner(urls);
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
    localStorage.setItem("urls", JSON.stringify(urls));
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
    <div className="urlshortener-bg">
      <form className="urlshortener-container" onSubmit={handleSubmit}>
        <div className="urlshortener-header">
          <div className="urlshortener-icon">🔗</div>
          <div className="urlshortener-title">Custom URL Shortener</div>
          <div className="urlshortener-subtitle">Create, share, and track your short links easily!</div>
        </div>
        <div className="urlshortener-form-group">
          <label className="urlshortener-label">Long URL:</label>
          <input
            className="urlshortener-input"
            ref={urlInput}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>
        <div className="urlshortener-form-group">
          <label className="urlshortener-label">Custom Shortcode (optional):</label>
          <input
            className="urlshortener-input"
            type="text"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            placeholder="e.g. my-link"
          />
          <small className="urlshortener-help">Leave blank for auto-generated code</small>
        </div>
        <div className="urlshortener-form-group">
          <label className="urlshortener-label">Validity (minutes):</label>
          <input
            className="urlshortener-input"
            type="number"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            min={1}
          />
          <small className="urlshortener-help">(Default: 30 min)</small>
        </div>
        {error && <div className="urlshortener-error">{error}</div>}
        {success && <div className="urlshortener-success">{success}</div>}
        <button className="urlshortener-submit" type="submit">
          Shorten URL
        </button>
      </form>
    </div>
  );
};

export default UrlShortener;
