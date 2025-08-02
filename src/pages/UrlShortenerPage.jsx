import React, { useState } from "react";
import { isValid } from "../utils/isValid";
import { isValidShortcode } from "../utils/isValidShortcode";
import { generateShorterner } from "../utils/generateShortener";
import "./UrlShortenerPage.css";

const MAX_URLS = 5;
const DEFAULT_VALIDITY = 30;

function getUrlsFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("urls")) || {};
  } catch {
    return {};
  }
}

function saveUrlsToStorage(urls) {
  localStorage.setItem("urls", JSON.stringify(urls));
}

const UrlShortenerPage = () => {
  const [inputs, setInputs] = useState(
    Array(MAX_URLS)
      .fill()
      .map(() => ({ url: "", validity: "", shortcode: "" }))
  );
  const [errors, setErrors] = useState(Array(MAX_URLS).fill(""));
  const [results, setResults] = useState([]);

  const handleInputChange = (idx, field, value) => {
    setInputs((inputs) => {
      const newInputs = [...inputs];
      newInputs[idx][field] = value;
      return newInputs;
    });
  };

  const validateInput = (input, urls) => {
    if (!input.url) return "URL is required.";
    if (!isValid(input.url)) return "Invalid URL format.";
    if (input.shortcode && !isValidShortcode(input.shortcode))
      return "Shortcode must be 3-20 chars, alphanumeric, dash or underscore.";
    if (
      input.validity &&
      (!Number.isFinite(+input.validity) || +input.validity <= 0)
    )
      return "Validity must be a positive integer (minutes).";
    const code = input.shortcode || generateShorterner(urls);
    if (urls[code]) return "Shortcode already exists.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let urls = getUrlsFromStorage();
    let newErrors = Array(MAX_URLS).fill("");
    let newResults = [];
    let hasError = false;
    const now = Date.now();

    inputs.forEach((input, idx) => {
      if (!input.url) return;
      const error = validateInput(input, urls);
      if (error) {
        newErrors[idx] = error;
        hasError = true;
        return;
      }
      let code = input.shortcode || generateShorterner(urls);
      let validityMinutes = input.validity
        ? parseInt(input.validity, 10)
        : DEFAULT_VALIDITY;
      const expiresAt = now + validityMinutes * 60 * 1000;
      urls[code] = { url: input.url, expiresAt };
      newResults.push({
        original: input.url,
        short: `${window.location.origin}/${code}`,
        expiresAt,
        code,
      });
    });
    setErrors(newErrors);
    if (!hasError) {
      saveUrlsToStorage(urls);
      setResults(newResults);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="urlshortener-bulk-container">
      <div className="urlshortener-bulk-title"> Bulk URL Shortener</div>
      <form className="urlshortener-bulk-form" onSubmit={handleSubmit}>
        {inputs.map((input, idx) => (
          <div className="urlshortener-bulk-row" key={idx}>
            <label className="urlshortener-bulk-label">Long URL:</label>
            <input
              className="urlshortener-bulk-input"
              type="text"
              value={input.url}
              onChange={(e) => handleInputChange(idx, "url", e.target.value)}
              placeholder="https://example.com"
            />
            <label className="urlshortener-bulk-label">
              Validity (minutes):
            </label>
            <input
              className="urlshortener-bulk-input"
              type="number"
              value={input.validity}
              onChange={(e) =>
                handleInputChange(idx, "validity", e.target.value)
              }
              min={1}
              placeholder={DEFAULT_VALIDITY}
            />
            <small>(Default: 30 min)</small>
            <label className="urlshortener-bulk-label">
              Custom Shortcode (optional):
            </label>
            <input
              className="urlshortener-bulk-input"
              type="text"
              value={input.shortcode}
              onChange={(e) =>
                handleInputChange(idx, "shortcode", e.target.value)
              }
              placeholder="e.g. my-link"
            />
            {errors[idx] && (
              <div className="urlshortener-bulk-error">{errors[idx]}</div>
            )}
          </div>
        ))}
        <button className="urlshortener-bulk-submit" type="submit">
          Shorten URLs
        </button>
      </form>
      {results.length > 0 && (
        <div className="urlshortener-bulk-results">
          <div className="urlshortener-bulk-results-title">Shortened URLs</div>
          <ul className="urlshortener-bulk-result-list">
            {results.map((res, idx) => (
              <li className="urlshortener-bulk-result-item" key={idx}>
                <div>
                  <span className="urlshortener-bulk-result-label">
                    Original:
                  </span>{" "}
                  <span style={{ wordBreak: "break-all" }}>{res.original}</span>
                </div>
                <div>
                  <span className="urlshortener-bulk-result-label">Short:</span>{" "}
                  <a
                    className="urlshortener-bulk-result-link"
                    href={res.short}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {res.short}
                  </a>
                </div>
                <div>
                  <span className="urlshortener-bulk-result-label">
                    Expires:
                  </span>{" "}
                  {new Date(res.expiresAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UrlShortenerPage;
