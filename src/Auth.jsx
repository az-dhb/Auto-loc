import { useState } from "react";
import "./Auth.css";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [active, setActive] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // SIGN UP
  const handleSignUp = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      alert("Check your email to confirm signup");
      return;
    }

    // 🔥 CREATE CLIENT PROFILE
    const { error: clientError } = await supabase
      .from("clients")
      .insert([
        {
          id: user.id,
          full_name: name,
          license_url: null,
          license_validated: false,
        },
      ]);

    if (clientError) {
      console.log(clientError);
      alert("Failed to create client profile");
      return;
    }

    alert("Account created successfully!");
    setActive(false);
  };

  // SIGN IN
  const handleSignIn = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`container ${active ? "active" : ""}`}>

        {/* SIGN UP */}
        <div className="form-box sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>

            <div className="socials">
              <button type="button">G</button>
              <button type="button">f</button>
              <button type="button">GH</button>
              <button type="button">in</button>
            </div>

            <p>or use your email for registration</p>

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="main-btn" type="submit">
              Sign Up
            </button>
          </form>
        </div>

        {/* SIGN IN */}
        <div className="form-box sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>

            <div className="socials">
              <button type="button">G</button>
              <button type="button">f</button>
              <button type="button">GH</button>
              <button type="button">in</button>
            </div>

            <p>or use your email password</p>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <a href="/">Forgot Your Password?</a>

            <button className="main-btn" type="submit">
              Sign In
            </button>
          </form>
        </div>

        {/* TOGGLE */}
        <div className="toggle-box">

          <div className="toggle-panel left-panel">
            <h1>Welcome Back!</h1>
            <p>Sign in to access your account and continue where you left off.</p>

            <button
              className="ghost-btn"
              onClick={() => setActive(false)}
              type="button"
            >
              SIGN IN
            </button>
          </div>

          <div className="toggle-panel right-panel">
            <h1>Hello New Friend!</h1>
            <p>Register with your personal details to use all site features.</p>

            <button
              className="ghost-btn"
              onClick={() => setActive(true)}
              type="button"
            >
              SIGN UP
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}