import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./Bookings.css";

export default function Bookings({ user }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
  if (!user) return;
  fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user]);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("reservations")
      .select(`
        id,
        start_date,
        end_date,
        status,
        cars (
          brand,
          model,
          price_per_day
        )
      `)
      .eq("client_id", user.id);

    setBookings(data || []);
  };

  return (
    <div className="bookings-page">

      <h2 className="page-title">My Bookings</h2>

      <div className="bookings-grid">

        {bookings.length === 0 ? (
          <p className="empty">No bookings yet.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="booking-card">

              <div className="top">
                <h3>
                  {b.cars?.brand} {b.cars?.model}
                </h3>

                <span className={`status ${b.status}`}>
                  {b.status}
                </span>
              </div>

              <div className="info">
                <p>${b.cars?.price_per_day}/day</p>
                <p>{b.start_date} → {b.end_date}</p>
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}