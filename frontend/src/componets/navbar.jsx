import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css"; // Import the CSS file

const Navbar = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2 className="brand">
        🎫 Ticket System
      </h2>

      <div className="right-section">
        {user ? (
          <>
            <span className="username">
              👤 {user.email} ({user.role})
            </span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
