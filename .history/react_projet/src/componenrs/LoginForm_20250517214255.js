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
        maxWidth: 370,
        margin: "60px auto",
        padding: "40px 32px",
        borderRadius: "18px",
        boxShadow: "0 8px 32px rgba(25, 118, 210, 0.18), 0 1.5px 8px rgba(0,0,0,0.08)",
        background: "linear-gradient(135deg, #e3f0ff 0%, #f9f9ff 100%)",
        fontFamily: "Segoe UI, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Magical Glow */}
      <div
        style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 180,
          height: 180,
          background: "radial-gradient(circle, #90caf9 0%, transparent 70%)",
          zIndex: 0,
          filter: "blur(12px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          right: -60,
          width: 180,
          height: 180,
          background: "radial-gradient(circle, #1976d2 0%, transparent 70%)",
          zIndex: 0,
          filter: "blur(18px)",
        }}
      />
      <h2
        style={{
          textAlign: "center",
          marginBottom: 28,
          color: "#1976d2",
          letterSpacing: 1,
          fontWeight: 700,
          fontSize: 28,
          zIndex: 1,
          position: "relative",
          textShadow: "0 2px 8px #90caf9",
        }}
      >
        ✨ Connexion Magique ✨
      </h2>
      <form onSubmit={handleSubmit} style={{ zIndex: 1, position: "relative" }}>
        <div style={{ marginBottom: 22 }}>
          <label
            style={{
              display: "block",
              marginBottom: 7,
              fontWeight: 600,
              color: "#1976d2",
              letterSpacing: 0.5,
            }}
          >
            Email :
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #90caf9",
              fontSize: 17,
              outline: "none",
              boxSizing: "border-box",
              background: "rgba(255,255,255,0.85)",
              boxShadow: "0 1px 4px rgba(25,118,210,0.07)",
              transition: "border 0.2s, box-shadow 0.2s",
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = "1.5px solid #90caf9"}
          />
        </div>

        <div style={{ marginBottom: 26 }}>
          <label
            style={{
              display: "block",
              marginBottom: 7,
              fontWeight: 600,
              color: "#1976d2",
              letterSpacing: 0.5,
            }}
          >
            Mot de passe :
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
              border: "1.5px solid #90caf9",
              fontSize: 17,
              outline: "none",
              boxSizing: "border-box",
              background: "rgba(255,255,255,0.85)",
              boxShadow: "0 1px 4px rgba(25,118,210,0.07)",
              transition: "border 0.2s, box-shadow 0.2s",
            }}
            onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
            onBlur={e => e.target.style.border = "1.5px solid #90caf9"}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 2px 12px #90caf9",
            transition: "background 0.2s, transform 0.1s",
            letterSpacing: 1,
            marginTop: 6,
          }}
          onMouseOver={e => e.target.style.background = "linear-gradient(90deg, #1565c0 60%, #42a5f5 100%)"}
          onMouseOut={e => e.target.style.background = "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)"}
        >
          ✨ Se connecter
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: 22,
            color: message === "Connexion réussie !" ? "#43a047" : "#d32f2f",
            textAlign: "center",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: 0.5,
            background: "rgba(255,255,255,0.7)",
            borderRadius: 8,
            padding: "10px 0",
            boxShadow: "0 1px 6px rgba(25,118,210,0.08)",
            zIndex: 2,
            position: "relative",
            textShadow: message === "Connexion réussie !" ? "0 1px 8px #b9f6ca" : "0 1px 8px #ffcdd2",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default LoginForm;
