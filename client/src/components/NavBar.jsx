import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };
  return (
    <div>
      {user ? (
        <div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/journal">My Journal</Link>
          </nav>
          <h1>Welcome, {user.username}!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <nav>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
          <h1>Please log in</h1>
        </div>
      )}
    </div>
  );
};

export default NavBar;
