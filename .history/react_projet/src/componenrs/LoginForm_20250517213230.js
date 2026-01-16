import React, { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Auth logic here
  };

  return (
    <div
      style={{
        maxWidth: 350,
        margin: "60px auto",
        padding: "32px",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        background: "#fff",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24, color: "#1976d2" }}>
        Connexion
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
              color: "#333",
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
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
              color: "#333",
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
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            background: "#1976d2",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Se connecter
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: 18,
            color: "#d32f2f",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default LoginForm;
