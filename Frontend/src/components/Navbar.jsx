export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        background: "#222",
        color: "white",
      }}
    >
      <div>
        <a href="/dashboard" style={{ color: "white" }}>
          Dashboard
        </a>
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}