import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SF_AUTH_URL } from "../utils/salesforce";

export default function Login({ auth }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.accessToken) {
      navigate("/dashboard");
    }
  }, [auth]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0070d2 0%, #005fb2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "48px",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        maxWidth: "400px",
        width: "100%",
      }}>
        <img
          src="https://www.salesforce.com/news/wp-content/uploads/sites/3/2021/05/Salesforce-logo.jpg"
          alt="Salesforce"
          style={{ width: "180px", marginBottom: "24px" }}
        />
        <h1 style={{ fontSize: "22px", color: "#032d60", marginBottom: "8px" }}>
          Validation Rule Manager
        </h1>
        <p style={{ color: "#666", marginBottom: "32px", fontSize: "14px" }}>
          Connect to your Salesforce org to manage Account validation rules
        </p>
        <a href={SF_AUTH_URL()} style={{ textDecoration: "none" }}>
          <button style={{
            background: "#0070d2",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "14px 32px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
            fontWeight: "600",
          }}>
            🔐 Login with Salesforce
          </button>
        </a>
      </div>
    </div>
  );
}