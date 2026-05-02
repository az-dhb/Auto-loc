import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import { showToast } from "./toast";
import { motion } from "motion/react";
import "./Dashboard.css";

export default function Dashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [myCars, setMyCars] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    await Promise.all([fetchProfile(), fetchReservations(), fetchMyCars()]);
  };

  /* ---------------- PROFILE ---------------- */
  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) return;
    setProfile(data);
  };

  /* ---------------- RESERVATIONS ---------------- */
  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        cars (
          id, brand, model,
          image_url, price_per_day,
          location, seats, fuel_type, transmission
        )
      `)
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      showToast("Failed to load reservations", "error");
      return;
    }

    const list = data || [];
    setReservations(list);
    setStats({
      total: list.length,
      pending: list.filter((r) => r.status === "pending").length,
      confirmed: list.filter((r) => r.status === "confirmed").length,
      cancelled: list.filter((r) => r.status === "cancelled").length,
    });
  };

  /* ---------------- MY CARS ---------------- */
  const fetchMyCars = async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return;
    setMyCars(data || []);
  };

  if (!profile) return <div className="dash-loading">Loading dashboard...</div>;

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >

      {/* ── WELCOME BANNER ── */}
      <div className="dash-welcome">
        <img
          src={profile.avatar_url || "https://i.imgur.com/6VBx3io.png"}
          className="dash-avatar"
          alt="avatar"
        />
        <div>
          <h1>Welcome back, {profile.full_name} 👋</h1>
          <p>{user.email}</p>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="dash-stats">
        <div className="stat-card total">
          <span className="stat-num">{stats.total}</span>
          <span className="stat-label">Total Bookings</span>
        </div>
        <div className="stat-card pending">
          <span className="stat-num">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card confirmed">
          <span className="stat-num">{stats.confirmed}</span>
          <span className="stat-label">Confirmed</span>
        </div>
        <div className="stat-card cancelled">
          <span className="stat-num">{stats.cancelled}</span>
          <span className="stat-label">Cancelled</span>
        </div>
      </div>

      {/* ── MY RESERVATIONS ── */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h2>My Reservations</h2>
          <button onClick={() => navigate("/cars")}>+ Book a Car</button>
        </div>

        {reservations.length === 0 ? (
          <div className="dash-empty">
            <p>No reservations yet.</p>
            <button onClick={() => navigate("/cars")}>Browse Cars</button>
          </div>
        ) : (
          <div className="dash-table">
            {reservations.map((r) => {
              const car = r.cars;
              return (
                <motion.div
                  key={r.id}
                  className="dash-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <img src={car?.image_url} alt={car?.model} className="dash-car-img" />
                  <div className="dash-car-info">
                    <strong>{car?.brand} {car?.model}</strong>
                    <small>📍 {car?.location}</small>
                    <small>⛽ {car?.fuel_type} · ⚙️ {car?.transmission} · 💺 {car?.seats} seats</small>
                  </div>
                  <div className="dash-dates">
                    <span>📅 {r.start_date}</span>
                    <span>→</span>
                    <span>📅 {r.end_date}</span>
                  </div>
                  <div className={`dash-status ${r.status}`}>
                    {r.status}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MY LISTED CARS ── */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h2>My Listed Cars</h2>
          <button onClick={() => navigate("/list-cars")}>+ List a Car</button>
        </div>

        {myCars.length === 0 ? (
          <div className="dash-empty">
            <p>You have not listed any cars yet.</p>
            <button onClick={() => navigate("/list-cars")}>List a Car</button>
          </div>
        ) : (
          <div className="dash-table">
            {myCars.map((car) => (
              <motion.div
                key={car.id}
                className="dash-row"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img src={car.image_url} alt={car.model} className="dash-car-img" />
                <div className="dash-car-info">
                  <strong>{car.brand} {car.model}</strong>
                  <small>📍 {car.location}</small>
                  <small>⛽ {car.fuel_type} · ⚙️ {car.transmission} · 💺 {car.seats} seats</small>
                </div>
                <div className="dash-dates">
                  <span>💰 {car.price_per_day} DA / day</span>
                </div>
                <div className={`dash-status ${car.status}`}>
                  {car.status}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
}