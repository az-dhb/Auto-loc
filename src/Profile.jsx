import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./Profile.css";
import { showToast } from "./toast";

export default function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [myCars, setMyCars] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchProfile();
    fetchReservations();
    fetchMyCars();
  }, [user]);

  /* ---------------- PROFILE ---------------- */
  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      showToast("Failed to load profile", "error");
      return;
    }

    setProfile(data);
  };

  /* ---------------- RESERVATIONS ---------------- */
  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        cars (
          id,
          brand,
          model,
          image_url,
          price_per_day,
          location,
          seats,
          fuel_type,
          transmission
        )
      `)
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      showToast("Failed to load reservations", "error");
      return;
    }

    setReservations(data || []);
  };

  /* ---------------- MY CARS ---------------- */
  const fetchMyCars = async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      showToast("Failed to load your cars", "error");
      return;
    }

    setMyCars(data || []);
  };

  /* ---------------- AVATAR ---------------- */
  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileName = `${user.id}-${Date.now()}`;

    const { data, error } = await supabase.storage
      .from("pfp")
      .upload(fileName, file);

    if (error) {
      setUploading(false);
      return showToast(error.message, "error");
    }

    const { data: urlData } = supabase.storage
      .from("pfp")
      .getPublicUrl(data.path || fileName);

    await supabase
      .from("clients")
      .update({ avatar_url: urlData.publicUrl })
      .eq("id", user.id);

    setUploading(false);
    showToast("Profile updated", "success");
    fetchProfile();
  };

  /* ---------------- LICENSE ---------------- */
  const uploadLicense = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileName = `${user.id}-license-${Date.now()}`;

    const { data, error } = await supabase.storage
      .from("driver-licenses")
      .upload(fileName, file);

    if (error) {
      setUploading(false);
      return showToast(error.message, "error");
    }

    const { data: urlData } = supabase.storage
      .from("driver-licenses")
      .getPublicUrl(data.path || fileName);

    await supabase
      .from("clients")
      .update({
        license_url: urlData.publicUrl,
        license_validated: false,
      })
      .eq("id", user.id);

    setUploading(false);
    showToast("License uploaded", "success");
    fetchProfile();
  };

  if (!profile) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">

        <div className="left">
          <img
            src={profile.avatar_url || "https://i.imgur.com/6VBx3io.png"}
            className="avatar"
            alt="avatar"
          />

          <label className="btn">
            {uploading ? "Uploading..." : "Change photo"}
            <input type="file" hidden onChange={uploadAvatar} />
          </label>
        </div>

        <div className="right">
          <h1>{profile.full_name}</h1>
          <p>{user.email}</p>
          <span>Member since {new Date(profile.created_at).toDateString()}</span>
        </div>

      </div>

      {/* LICENSE */}
      <div className="section">
        <div className="section-title">Driver License</div>

        {profile.license_url ? (
          <img className="license" src={profile.license_url} />
        ) : (
          <p>No license uploaded</p>
        )}

        <div className="license-row">
          <label className="btn dark">
            Upload license
            <input type="file" hidden onChange={uploadLicense} />
          </label>

          <span className={`badge ${profile.license_validated ? "ok" : "pending"}`}>
            {profile.license_validated ? "Verified" : "Pending"}
          </span>
        </div>
      </div>

      {/* MY LISTED CARS */}
      <div className="section">
        <div className="section-title">My Listed Cars</div>

        {myCars.length === 0 ? (
          <p>You have not listed any cars yet.</p>
        ) : (
          <div className="table">
            {myCars.map((car) => (
              <div key={car.id} className="row">

                <div className="car">
                  <img src={car.image_url} alt={car.model} />
                  <div>
                    <strong>{car.brand} {car.model}</strong>
                    <small>{car.location}</small>
                  </div>
                </div>

                <div className="meta">
                  <span>{car.fuel_type}</span>
                  <span>{car.transmission}</span>
                  <span>{car.seats} seats</span>
                </div>

                <div className="dates">
                  {car.price_per_day} DA / day
                </div>

                <div className={`status ${car.status}`}>
                  {car.status}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESERVATIONS */}
      <div className="section">
        <div className="section-title">Reservations</div>

        <div className="table">
          {reservations.map((r) => {
            const car = r.cars;

            return (
              <div key={r.id} className="row">

                <div className="car">
                  <img src={car?.image_url} />
                  <div>
                    <strong>{car?.brand} {car?.model}</strong>
                    <small>{car?.location}</small>
                  </div>
                </div>

                <div className="meta">
                  <span>{car?.fuel_type}</span>
                  <span>{car?.transmission}</span>
                  <span>{car?.seats} seats</span>
                </div>

                <div className="dates">
                  {r.start_date} → {r.end_date}
                </div>

                <div className={`status ${r.status}`}>
                  {r.status}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}