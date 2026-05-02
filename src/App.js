import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { MotionConfig } from "motion/react";
import { supabase } from "./supabaseClient";
import ListCars from "./ListCars";
import Layout from "./Layout";
import Home from "./Home";
import Cars from "./Cars";
import Bookings from "./Bookings";
import Auth from "./Auth";
import CarDetails from "./CarDetails";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import Toast from "./Toast.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (mounted) {
        setUser(data?.user ?? null);
        setLoading(false);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return null;
  }

  return (
    <MotionConfig
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      <BrowserRouter>

        {/* GLOBAL TOAST */}
        <Toast />

        <Routes>

          {/* AUTH ROUTE */}
          <Route
            path="/auth"
            element={
              !user ? <Auth /> : <Navigate to="/" replace />
            }
          />

          {/* MAIN APP WRAPPER */}
          <Route
            path="/"
            element={
              user ? <Layout user={user} /> : <Navigate to="/auth" replace />
            }
          >

            {/* HOME */}
            <Route index element={<Home />} />

            {/* CARS */}
            <Route path="cars" element={<Cars user={user} />} />

            {/* CAR DETAILS */}
            <Route path="cars/:id" element={<CarDetails user={user} />} />

            {/* BOOKINGS */}
            <Route path="bookings" element={<Bookings user={user} />} />

            {/* PROFILE */}
            <Route path="profile" element={<Profile user={user} />} />

            {/* LIST CAR */}
            <Route path="list-cars" element={<ListCars user={user} />} />

            {/* DASHBOARD */}
            <Route path="dashboard" element={<Dashboard user={user} />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;