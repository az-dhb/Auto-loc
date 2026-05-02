import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./toast.css";

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      setToast(e.detail);

      setTimeout(() => {
        setToast(null);
      }, 3000);
    };

    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className={`toast ${toast.type}`}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {toast.type === "error" && <span>⚠️</span>}
          <span>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}