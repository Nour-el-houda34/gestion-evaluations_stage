import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: motDePasse }),
      });

      const data = await response.json();

      if (data.error) {
        setMessage(data.error);
      } else if (data.message) {
        setMessage(data.message);

        if (data.message.toLowerCase().includes("réussie")) {
          setTimeout(() => {
            navigate("/Dashboard");
          }, 1000);
        }
      } else {
        setMessage("Réponse inattendue");
      }
    } catch (error) {
      setMessage("Erreur réseau ou serveur indisponible");
      console.error("Erreur login:", error);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: "40px 36px",
        borderRadius: "18px",
        boxShadow: "0 8px 32px rgba(25, 118, 210, 0.12), 0 1.5px 4px rgba(0,0,0,0.06)",
        background: "linear-gradient(135deg, #f7fafd 0%, #e3ecfa 100%)",
        fontFamily: "Segoe UI, Arial, sans-serif",
        border: "1px solid #e3ecfa",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="24" fill="#1976d2" />
          <path d="M24 14a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 18c5.33 0 10 2.17 10 4v2H14v-2c0-1.83 4.67-4 10-4z" fill="#fff"/>
        </svg>
        <h2 style={{ margin: "16px 0 0", color: "#1976d2", fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>
          Connexion
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 22 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
              color: "#1976d2",
              fontSize: 15,
              letterSpacing: 0.2,
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #b6c7e3",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
              background: "#fafdff",
              transition: "border 0.2s",
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = "1.5px solid #b6c7e3"}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
              color: "#1976d2",
              fontSize: 15,
              letterSpacing: 0.2,
            }}
          >
            Mot de passe
          </label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #b6c7e3",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
              background: "#fafdff",
              transition: "border 0.2s",
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = "1.5px solid #b6c7e3"}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(90deg, #1976d2 60%, #1565c0 100%)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 17,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.10)",
            letterSpacing: 0.5,
            transition: "background 0.2s, box-shadow 0.2s",
          }}
          onMouseOver={e => e.currentTarget.style.background = "#1565c0"}
          onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #1976d2 60%, #1565c0 100%)"}
        >
          Se connecter
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: 24,
            padding: "12px",
            borderRadius: "7px",
            background: message === "Connexion réussie !" ? "#e8f5e9" : "#ffebee",
            color: message === "Connexion réussie !" ? "#388e3c" : "#d32f2f",
            textAlign: "center",
            fontWeight: 600,
            fontSize: 15,
            border: message === "Connexion réussie !" ? "1px solid #c8e6c9" : "1px solid #ffcdd2",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default LoginForm;
