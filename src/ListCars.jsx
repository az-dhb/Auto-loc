import { useState } from "react";
import { supabase } from "./supabaseClient";
import { showToast } from "./toast";
import "./ListCars.css";

export default function ListCars({ user }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    price_per_day: "",
    transmission: "Automatic",
    location: "",
    seats: 5,
    fuel_type: "Petrol",
    description: "",
    features: "",
    image: null,
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFile = (e) => {
    setForm((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        }));
        showToast("Location detected", "success");
      },
      () => showToast("Location failed", "error")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Always get a fresh session directly from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        showToast("You must be logged in to list a car", "error");
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      let imageUrl = "";

      /* UPLOAD IMAGE */
      if (form.image) {
        const fileName = `${Date.now()}-${form.image.name}`;

        const { data, error } = await supabase.storage
          .from("cars-images")
          .upload(fileName, form.image);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("cars-images")
          .getPublicUrl(data.path);

        imageUrl = urlData.publicUrl;
      }

      /* FEATURES -> ARRAY */
      const featuresArray = form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      /* INSERT INTO SUPABASE */
      const { error } = await supabase.from("cars").insert([
        {
          brand: form.brand,
          model: form.model,
          year: Number(form.year),
          price_per_day: Number(form.price_per_day),
          transmission: form.transmission,
          location: form.location,
          seats: Number(form.seats),
          fuel_type: form.fuel_type,
          description: form.description,
          features: featuresArray,
          image_url: imageUrl,
          owner_id: userId,
          status: "pending",
        },
      ]);

      if (error) throw error;

      showToast("Car submitted for approval!", "success");

      /* RESET */
      setForm({
        brand: "",
        model: "",
        year: "",
        price_per_day: "",
        transmission: "Automatic",
        location: "",
        seats: 5,
        fuel_type: "Petrol",
        description: "",
        features: "",
        image: null,
      });
    } catch (err) {
      showToast(err.message, "error");
    }

    setLoading(false);
  };

  return (
    <div className="listcars-page">
      <h2>List a New Car</h2>

      <form className="form" onSubmit={handleSubmit}>
        {/* BASIC INFO */}
        <div className="box">
          <input name="brand" placeholder="Brand" onChange={handleChange} />
          <input name="model" placeholder="Model" onChange={handleChange} />
          <input name="year" placeholder="Year" onChange={handleChange} />
        </div>

        {/* PRICE + SEATS */}
        <div className="box">
          <input
            name="price_per_day"
            placeholder="Price / day"
            onChange={handleChange}
          />
          <input name="seats" placeholder="Seats" onChange={handleChange} />
        </div>

        {/* OPTIONS */}
        <div className="box">
          <select name="transmission" onChange={handleChange}>
            <option>Automatic</option>
            <option>Manual</option>
          </select>

          <select name="fuel_type" onChange={handleChange}>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>Hybrid</option>
          </select>
        </div>

        {/* LOCATION */}
        <div className="box">
          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
          />
          <button type="button" onClick={getLocation}>
            Detect
          </button>
        </div>

        {/* FEATURES */}
        <div className="box full">
          <input
            name="features"
            placeholder="Features (GPS, AC, Bluetooth...)"
            onChange={handleChange}
          />
        </div>

        {/* IMAGE */}
        <div className="box full">
          <input type="file" onChange={handleFile} />
        </div>

        {/* DESCRIPTION */}
        <div className="box full">
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
          />
        </div>

        {/* SUBMIT */}
        <button disabled={loading}>
          {loading ? "Listing..." : "List Car"}
        </button>
      </form>
    </div>
  );
}