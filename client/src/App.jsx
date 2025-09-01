import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Nav from "./components/Nav.jsx";
import { me } from "./lib/api.js";

function Home(){
  return (
    <div className="container section">
      <p className="kicker">Welcome</p>
      <h1 className="h1">You’re home. Let’s keep this simple and kind.</h1>
      <div className="grid" style={{gridTemplateColumns:'1.2fr .8fr'}}>
        <div className="card">
          <h2 className="h2">Today</h2>
          <p className="muted">Recent journal, week size, and rights updates will show here.</p>
        </div>
        <div className="card">
          <h2 className="h2">Quick links</h2>
          <ul>
            <li><a href="/journal">Open Journal</a></li>
            <li><a href="/rights">Know Your Rights</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Rights(){
  return (
    <div className="container section">
      <p className="kicker">Know Your Rights</p>
      <h1 className="h1">State‑by‑state rights</h1>
      <div className="card">Hook this to your data fetch (server or static JSON).</div>
    </div>
  );
}

function Journal(){
  return (
    <div className="container section">
      <p className="kicker">Journal</p>
      <h1 className="h1">Your thoughts, your space</h1>
      <div className="card">Editor or simple textarea → POST to /api/journal</div>
    </div>
  );
}

function Login(){
  return (
    <div className="container section">
      <div className="card" style={{maxWidth:480}}>
        <h1 className="h2">Log in</h1>
        {/* your existing form is fine — just ensure fetch has credentials: 'include' */}
      </div>
    </div>
  );
}

function Register(){
  return (
    <div className="container section">
      <div className="card" style={{maxWidth:520}}>
        <h1 className="h2">Create account</h1>
      </div>
    </div>
  );
}

function Protected({ user, children }){
  if(!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App(){
  const [user,setUser] = useState(null);
  useEffect(()=>{ me().then((u)=> u?.id ? setUser(u) : setUser(null)).catch(()=>setUser(null)); },[]);

  return (
    <BrowserRouter>
      <Nav user={user} />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/rights" element={<Rights/>} />
        <Route path="/journal" element={<Protected user={user}><Journal/></Protected>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <footer className="footer"><div className="container muted">© {new Date().getFullYear()} myQueerPregnancy</div></footer>
    </BrowserRouter>
  );
}
