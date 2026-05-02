import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("Loading...");

    try {
      // 🔹 LOGIN
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(error.message);
        } else {
          setMessage("Logged in ✅");
        }
      }

      // 🔹 REGISTER
      else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        const user = data.user;

        // 👉 IMPORTANT: insert into clients table manually
        if (user) {
          const { error: insertError } = await supabase
            .from("clients")
            .insert([
              {
                id: user.id,
                full_name: fullName || "New User",
              },
            ]);

          if (insertError) {
            setMessage(insertError.message);
            return;
          }
        }

        setMessage("Account created 🎉 Check email if confirmation is ON");
      }
    } catch (err) {
      setMessage("Something went wrong");
      console.error(err);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p style={styles.message}>{message}</p>

        <p style={styles.footer}>
          {isLogin ? "No account?" : "Already have one?"}{" "}
          <span
            style={styles.link}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0, #f1f5f9)",
  },
  card: {
    backdropFilter: "blur(20px)",
    background: "rgba(255, 255, 255, 0.7)",
    padding: "40px",
    borderRadius: "20px",
    width: "340px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255,255,255,0.5)",
  },
  title: {
    textAlign: "center",
    color: "#0f172a",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    outline: "none",
    background: "white",
  },
  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #38bdf8, #6366f1)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  footer: {
    fontSize: "14px",
    textAlign: "center",
    color: "#64748b",
  },
  link: {
    color: "#6366f1",
    cursor: "pointer",
    fontWeight: "500",
  },
  message: {
    textAlign: "center",
    fontSize: "14px",
    color: "#0f172a",
  },
};