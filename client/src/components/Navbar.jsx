import "../styles/dashboard.css";

function Navbar({ userName, onLogout }) {
  return (
    <nav className="topbar">
      <div className="brand">
        <h2>InsightBoard</h2>
        <p>FULL-STACK ANALYTICS DASHBOARD</p>
      </div>

      <div className="topbar-right">
        <div className="avatar">
          {userName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <span className="nav-username">{userName || "User"}</span>

        <button onClick={onLogout}>Logout →</button>
      </div>
    </nav>
  );
}

export default Navbar;