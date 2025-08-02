import React from "react";
import UrlShortener from "./components/UrlShortener";
import RedirectHandler from "./components/RedirectHandler";
import UrlShortenerPage from "./pages/UrlShortenerPage";
import UrlShortenerStatsPage from "./pages/UrlShortenerStatsPage";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<UrlShortener />} />
        <Route path="/bulk" element={<UrlShortenerPage />} />
        <Route path="/stats" element={<UrlShortenerStatsPage />} />
        <Route path=":code" element={<RedirectHandler />} />
      </Routes>
    </Router>
  );
}

export default App;
