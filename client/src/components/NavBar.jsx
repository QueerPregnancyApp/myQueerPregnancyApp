// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// const NavBar = ({ user, setUser }) => {
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     navigate("/");
//   };
//   return(
//     <div className="navbar"> {/* Apply the navbar class to the surrounding div */}
//       {user ? (
//         <div>
//           <nav>
//             <Link to="/" className="nav-link-large">Home</Link> {/* Apply the class to Home link */}
//             <Link to="/journal" className="nav-link-large">My Journal</Link> {/* Apply the class to MyJournal link */}
//           </nav>
//           <h1>Welcome, {user.username}!</h1>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       ) : (
//         <div>
//           <nav>
//             <Link to="/" className="nav-link-large">Login</Link> {/* Apply the class to Login link */}
//             <Link to="/register" className="nav-link-large">Register</Link> {/* Apply the class to Register link */}
//           </nav>
//           <h1>Please log in</h1>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NavBar;

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// const NavBar = ({ user, setUser }) => {
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <div className="navbar">
//       <nav className="nav-links">
//         {user ? (
//           <>
//             <Link to="/" className="nav-link">
//               Home
//             </Link>
//             <Link to="/journal" className="nav-link">
//               My Journal
//             </Link>
//           </>
//         ) : (
//           <>
//             <Link to="/" className="nav-link">
//               Login
//             </Link>
//             <Link to="/register" className="nav-link">
//               Register
//             </Link>
//           </>
//         )}
//       </nav>

//       {user ? (
//         <>
//           <h1>Welcome, {user.username}!</h1>
//           <button onClick={handleLogout} className="logout-button">
//             Logout
//           </button>
//         </>
//       ) : (
//         <h1>Please log in</h1>
//       )}
//     </div>
//   );
// };

// export default NavBar;

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
    <div className="navbar">
      <div className="left-box">
        <p className="app-title">My Queer Pregnancy App</p>
        <nav className="nav-links">
          {user ? (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/journal" className="nav-link">
                My Journal
              </Link>
              <Link to="/states-rights" className="nav-link">
                States Rights
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="right-box">
        {user ? (
          <div>
            {/* <h1 className="welcome-text">Welcome</h1> */}

            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <h1>Please log in</h1>
        )}
      </div>
    </div>
  );
};

export default NavBar;
