import { Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";
import JournalList from "./pages/JournalList.jsx";
import JournalForm from "./pages/JournalForm.jsx";
import Rights from "./pages/Rights.jsx"; // ← add this

export default function App() {
  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <h1 style={{ margin: 0 }}>My Queer Pregnancy</h1>
          <nav className="nav-links">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/journal">Journal</NavLink>
            <NavLink to="/rights">Know Your Rights</NavLink> {/* ← add this */}
            <Link to="/journal/new" className="button">
              New Entry
            </Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<JournalList />} />
          <Route path="/journal/new" element={<JournalForm />} />
          <Route path="/rights" element={<Rights />} /> {/* ← add this */}
        </Routes>
      </main>
    </>
  );
}
