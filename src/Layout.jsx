import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./Account.css";

export default function Layout({ user }) {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="rental-page">

      {/* NAVBAR (ALWAYS VISIBLE) */}
      <header className="navbar">

        <div className="nav-left">
          <img src="/logo.png" className="logo-img" alt="logo" />

          <h2>My Ride</h2>

          <nav className="nav-links">
            <span onClick={() => navigate("/")}>Home</span>
            <span onClick={() => navigate("/cars")}>Cars</span>
            <span onClick={() => navigate("/bookings")}>My Bookings</span>
            <span onClick={() => navigate("/list-cars")}>List Car</span>
            <span onClick={() => navigate("/dashboard")}>Dashboard</span>
            <span onClick={() => navigate("/profile")}>Profile</span>
          </nav>
        </div>

        <div className="nav-right">
          <span className="user">{user.email}</span>

          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>

      </header>

      {/* PAGE CONTENT CHANGES HERE */}
      <main>
        <Outlet />
      </main>

    </div>
  );
}