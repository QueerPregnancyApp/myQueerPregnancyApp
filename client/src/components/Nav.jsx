import { NavLink } from "react-router-dom";

export default function Nav({ user }){
  return (
    <div className="nav">
      <div className="nav-inner container">
        <NavLink to="/" className="h2" style={{textDecoration:'none'}}>myQueerPregnancy</NavLink>
        <nav style={{display:'flex',gap:12}}>
          <NavLink to="/rights">Rights</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          {user ? (
            <>
              <span className="muted">★ {user.username}</span>
              <NavLink to="/logout">Logout</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
