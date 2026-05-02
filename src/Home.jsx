import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import "./Home.css";

export default function Home() {

  const [cars, setCars] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    fetchCars();

  }, []);

  /* FETCH CARS */
  const fetchCars = async () => {
  const { data } = await supabase
    .from("cars")
    .select("*")
    .eq("status", "approved") // ← only approved cars
    .limit(8);

  setCars(data || []);
};

  /* ANIMATIONS */
  const fadeUp = {
    initial: {
      opacity: 0,
      y: 40,
    },

    animate: {
      opacity: 1,
      y: 0,
    }
  };

  return (

    <motion.div
      className="home-page"

      initial={{
        opacity: 0
      }}

      animate={{
        opacity: 1
      }}

      transition={{
        duration: 0.7
      }}
    >

      {/* HERO */}
      <motion.section
        className="hero"

        variants={fadeUp}

        initial="initial"

        animate="animate"

        transition={{
          duration: 0.7
        }}
      >

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Find Your Perfect Car
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.7
          }}
        >
          Luxury, economy & sports cars available instantly
        </motion.p>

      </motion.section>

      {/* HERO IMAGE */}
      <motion.section
        className="hero-image"

        initial={{
          opacity: 0,
          scale: 0.95
        }}

        animate={{
          opacity: 1,
          scale: 1
        }}

        transition={{
          duration: 0.9
        }}
      >

        <motion.img
          src="car.png"
          alt="Luxury car"

          initial={{
            scale: 1.1
          }}

          animate={{
            scale: 1
          }}

          transition={{
            duration: 1.2
          }}
        />

      </motion.section>

      {/* CARS GRID */}
      <section className="car-grid">

        {cars.map((car, index) => (

          <motion.div
            key={car.id}

            className="car-card"

            initial={{
              opacity: 0,
              y: 50
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              delay: index * 0.08,
              duration: 0.5
            }}

            whileHover={{
              y: -8,
              scale: 1.03
            }}
          >

            {/* IMAGE */}
            <div className="car-img">

              <motion.img
                src={car.image_url}
                alt="car"

                whileHover={{
                  scale: 1.08
                }}

                transition={{
                  duration: 0.4
                }}
              />

            </div>

            {/* TAG */}
            <span
              className={`tag ${
                car.available ? "ok" : "no"
              }`}
            >
              {car.available
                ? "Available"
                : "Unavailable"}
            </span>

            {/* TITLE */}
            <h3>
              {car.brand} {car.model}
            </h3>

            {/* PRICE */}
            <p className="price">
              ${car.price_per_day}/day
            </p>

            {/* DETAILS */}
            <div className="car-details">

              <span>
                ⚙️ {car.transmission || "Automatic"}
              </span>

              <span>
                📍 {car.location || "N/A"}
              </span>

              <span>
                💺 {car.seats || "5"} Seats
              </span>

              <span>
                ⛽ {car.fuel_type || "Petrol"}
              </span>

            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.03
              }}

              whileTap={{
                scale: 0.96
              }}

              onClick={() =>
                navigate(`/cars/${car.id}`)
              }
            >
              Rent Now
            </motion.button>

          </motion.div>

        ))}

      </section>

      {/* EXPLORE BUTTON */}
      <motion.div
        className="center"

        initial={{
          opacity: 0,
          y: 20
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          delay: 0.4,
          duration: 0.7
        }}
      >

        <motion.button
          className="explore-btn"

          whileHover={{
            scale: 1.04,
            y: -2
          }}

          whileTap={{
            scale: 0.96
          }}

          onClick={() => navigate("/cars")}
        >
          Explore All Cars →
        </motion.button>

      </motion.div>

      {/* FOOTER */}
      <motion.footer
        className="footer"

        initial={{
          opacity: 0
        }}

        animate={{
          opacity: 1
        }}

        transition={{
          delay: 0.5,
          duration: 1
        }}
      >

        <div className="footer-top">

          {/* BRAND */}
          <div className="footer-brand">

            <img
              src="/logo.png"
              alt="logo"
              className="footer-logo"
            />

            <h3>MyRide</h3>

            <p>
              Your trusted car rental platform.
              Drive the car you deserve.
            </p>

          </div>

          {/* LINKS */}
          <div className="footer-links">

            <h4>Quick Links</h4>

            <span onClick={() => navigate("/")}>
              Home
            </span>

            <span onClick={() => navigate("/cars")}>
              Cars
            </span>

            <span onClick={() => navigate("/bookings")}>
              My Bookings
            </span>

          </div>

          {/* SOCIALS */}
          <div className="footer-social">

            <h4>Follow Us</h4>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
            >
              Twitter / X
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>

          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © 2026 MyRide.
            All rights reserved.
          </p>
        </div>

      </motion.footer>

    </motion.div>
  );
}