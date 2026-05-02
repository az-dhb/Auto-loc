import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./Cars.css";
import { useNavigate } from "react-router-dom";

export default function Cars({ user }) {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const carsPerPage = 20;

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCars = async () => {
    const { data } = await supabase
      .from("cars")
      .select("*")
      .eq("status", "approved");

    setCars(data || []);
  };

  const startIndex = (page - 1) * carsPerPage;
  const currentCars = cars.slice(startIndex, startIndex + carsPerPage);
  const totalPages = Math.ceil(cars.length / carsPerPage);

  return (
    <div className="cars-page">

      <h1 className="page-title">All Cars</h1>

      <div className="car-grid">
        {currentCars.map((car) => (
          <div key={car.id} className="car-card">

            <div className="car-img">
              <img src={car.image_url} alt={car.model} />
            </div>

            <span className={`tag ${car.available ? "ok" : "no"}`}>
              {car.available ? "Available" : "Unavailable"}
            </span>

            <h3>{car.brand} {car.model}</h3>

            <p className="price">
              {car.price_per_day} DA/day
            </p>

            <div className="car-details">
              <span>⚙️ {car.transmission || "Auto"}</span>
              <span>📍 {car.location || "N/A"}</span>
              <span>💺 {car.seats || "5"} Seats</span>
              <span>⛽ {car.fuel_type || "Petrol"}</span>
            </div>

            <button onClick={() => navigate(`/cars/${car.id}`)}>
              Rent Now
            </button>

          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>Page {page} / {totalPages}</span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}