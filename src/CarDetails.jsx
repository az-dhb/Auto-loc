import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./CarDetails.css";

import { showToast } from "./toast";

export default function CarDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    fetchCar();
  }, []);

  const fetchCar = async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      showToast("Failed to load car details", "error");
      return;
    }

    setCar(data);
  };

  const handleBooking = async () => {
    if (!car) return;

    // 1. Availability check
    if (!car.available) {
      showToast("This car is currently unavailable", "error");
      return;
    }

    // 2. Date validation
    if (!pickup || !returnDate) {
      showToast("Please select pickup and return dates", "error");
      return;
    }

    if (new Date(pickup) >= new Date(returnDate)) {
      showToast("Return date must be after pickup date", "error");
      return;
    }

    // 3. Client check
    const { data: client, error } = await supabase
      .from("clients")
      .select("license_url, license_validated")
      .eq("id", user.id)
      .single();

    if (error || !client) {
      showToast("Client not found", "error");
      return;
    }

    if (!client.license_url) {
      showToast("Upload your driving license first", "error");
      return;
    }

    if (!client.license_validated) {
      showToast("Your license is not validated yet", "error");
      return;
    }

    // 4. Create reservation
    const { error: insertError } = await supabase
      .from("reservations")
      .insert([
        {
          client_id: user.id,
          car_id: car.id,
          start_date: pickup,
          end_date: returnDate,
          status: "pending",
          license_url: client.license_url,
        },
      ]);

    if (insertError) {
      console.log(insertError);
      showToast("Booking failed", "error");
      return;
    }

    showToast("Reservation created successfully", "success");
  };

  if (!car) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="details-page">

      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-container">

        {/* LEFT SIDE */}
        <div className="details-left">

          <div className="hero-image">
            <img src={car.image_url} alt={car.model} />
          </div>

          <div className="car-header">
            <div>
              <h1>{car.brand} {car.model}</h1>
              <p className="price">${car.price_per_day}/day</p>
            </div>

            <span className={`availability ${car.available ? "ok" : "no"}`}>
              {car.available ? "Available" : "Unavailable"}
            </span>
          </div>

          <div className="specs-grid">
            <div className="spec-card">💺 {car.seats} Seats</div>
            <div className="spec-card">⛽ {car.fuel_type}</div>
            <div className="spec-card">⚙️ {car.transmission}</div>
            <div className="spec-card">📍 {car.location}</div>
          </div>

          <div className="content-card">
            <h2>Description</h2>
            <p>
              {car.description ||
                `${car.brand} ${car.model} is a premium vehicle designed for comfort and performance.`
              }
            </p>
          </div>

          <div className="content-card">
            <h2>Features</h2>

            <div className="features-grid">
              {car.features?.length ? (
                car.features.map((f, i) => (
                  <span key={i}>✔ {f}</span>
                ))
              ) : (
                <>
                  <span>✔ Air Conditioning</span>
                  <span>✔ GPS Navigation</span>
                  <span>✔ Bluetooth</span>
                </>
              )}
            </div>
          </div>

        </div>

        {/* BOOKING SIDE */}
        <div className="booking-card">

          <h2>${car.price_per_day}/day</h2>

          <div className="date-group">
            <label>Pickup</label>
            <input
              type="date"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </div>

          <div className="date-group">
            <label>Return</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>

          <button
            onClick={handleBooking}
            disabled={!car.available}
            className={!car.available ? "disabled-btn" : ""}
          >
            {car.available ? "Book Now" : "Unavailable"}
          </button>

          <p className="microcopy">
            No credit card required to reserve
          </p>

        </div>

      </div>
    </div>
  );
}