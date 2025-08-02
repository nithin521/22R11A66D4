import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className={location.pathname === "/" ? "navbar-link active" : "navbar-link"}>Single</Link>
        <Link to="/bulk" className={location.pathname === "/bulk" ? "navbar-link active" : "navbar-link"}>Bulk</Link>
        <Link to="/stats" className={location.pathname === "/stats" ? "navbar-link active" : "navbar-link"}>Stats</Link>
      </div>
    </nav>
  );
};

export default Navbar;
