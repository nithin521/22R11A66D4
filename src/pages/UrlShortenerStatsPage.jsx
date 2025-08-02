import React, { useEffect, useState } from "react";
import "./UrlShortenerStatsPage.css";

function getUrlsFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("urls")) || {};
  } catch {
    return {};
  }
}

function getClicksFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("urlClicks")) || {};
  } catch {
    return {};
  }
}

const UrlShortenerStatsPage = () => {
  const [urls, setUrls] = useState({});
  const [clicks, setClicks] = useState({});

  useEffect(() => {
    // Initial load
    setUrls(getUrlsFromStorage());
    setClicks(getClicksFromStorage());
    // Poll for updates every 1s
    const interval = setInterval(() => {
      setUrls(getUrlsFromStorage());
      setClicks(getClicksFromStorage());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sort: non-expired first, then expired
  const now = Date.now();
  const urlEntries = Object.entries(urls);
  const sortedEntries = urlEntries.sort(([, a], [, b]) => {
    const aExpired = a.expiresAt && now > a.expiresAt;
    const bExpired = b.expiresAt && now > b.expiresAt;
    if (aExpired === bExpired) return 0;
    return aExpired ? 1 : -1;
  });

  return (
    <div className="stats-container">
      <h2 className="stats-title">Shortened URL Statistics</h2>
      {sortedEntries.length === 0 && <div className="stats-no-urls">No shortened URLs found.</div>}
      {sortedEntries.map(([code, data]) => {
        const clickList = clicks[code] || [];
        const isExpired = data.expiresAt && now > data.expiresAt;
        return (
          <div className="stats-url-block" key={code}>
            <div style={{ marginBottom: 6 }}>
              <span className="stats-url-label">Short URL:</span>{" "}
              <a href={`/${code}`} target="_blank" rel="noopener noreferrer">
                {window.location.origin}/{code}
              </a>
              {isExpired && <span className="stats-expired-tag">Expired</span>}
            </div>
            <div>
              <span className="stats-url-label">Original URL:</span>{" "}
              <span className="stats-url-original">{data.url}</span>
            </div>
            <div>
              <span className="stats-url-label">Created:</span>{" "}
              {data.createdAt
                ? new Date(data.createdAt).toLocaleString()
                : "(unknown)"}
            </div>
            <div>
              <span className="stats-url-label">Expires:</span>{" "}
              {data.expiresAt
                ? new Date(data.expiresAt).toLocaleString()
                : "(unknown)"}
            </div>
            <div>
              <span className="stats-url-label">Total Clicks:</span> {clickList.length}
            </div>
            {clickList.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <b>Click Details:</b>
                <ul className="stats-click-list">
                  {clickList.map((click, idx) => (
                    <li className="stats-click-item" key={idx}>
                      <div>
                        <b>Time:</b>{" "}
                        {new Date(click.timestamp).toLocaleString()}
                      </div>
                      <div>
                        <b>Source:</b> {click.referrer || "Direct/Unknown"}
                      </div>
                      <div>
                        <b>Location:</b>{" "}
                        {click.city
                          ? `${click.city}, ${click.country}`
                          : "Unknown"}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UrlShortenerStatsPage;
