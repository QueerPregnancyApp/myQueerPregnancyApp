import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import MyJournal from "./components/MyJournal";
import StatesRights from "./components/StatesRights";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);


  return (
    <>
      <NavBar user={user} setUser={setUser} />
      {user ? (
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route
            path="/journal"
            element={<MyJournal user={user} setUser={setUser} />}
          />
          <Route path="/states-rights" element={<StatesRights />} />{" "}
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LoginForm setUser={setUser} />} />
          <Route
            path="/register"
            element={<RegisterForm setUser={setUser} />}
          />
        </Routes>
      )}
    </>
  );
}

export default App;
