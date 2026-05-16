import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function OAuthCallback({ setAuth }) {
  const navigate = useNavigate();
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const instanceUrl = params.get("instance_url");
    if (accessToken && instanceUrl) {
      localStorage.setItem("sf_access_token", accessToken);
      localStorage.setItem("sf_instance_url", instanceUrl);
      setAuth({ accessToken, instanceUrl });
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, []);
  return <p style={{ textAlign: "center", marginTop: "100px" }}>Authenticating with Salesforce...</p>;
}

export default function App() {
  const [auth, setAuth] = useState({
  accessToken: localStorage.getItem("sf_access_token") || process.env.REACT_APP_SF_ACCESS_TOKEN,
  instanceUrl: localStorage.getItem("sf_instance_url") || process.env.REACT_APP_SF_INSTANCE_URL,
});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login auth={auth} />} />
        <Route path="/oauth/callback" element={<OAuthCallback setAuth={setAuth} />} />
        <Route path="/dashboard" element={<Dashboard auth={auth} setAuth={setAuth} />} />
      </Routes>
    </BrowserRouter>
  );
}