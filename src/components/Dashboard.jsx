import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getValidationRules, toggleValidationRule } from "../utils/salesforce";
import ValidationRuleList from "./ValidationRuleList";

export default function Dashboard({ auth, setAuth }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [deploying, setDeploying] = useState(false);
  const navigate = useNavigate();

  if (!auth?.accessToken) {
    navigate("/");
    return null;
  }

  const fetchRules = async () => {
    setLoading(true);
    setStatus("Fetching validation rules...");
    try {
      const data = await getValidationRules();
      setRules(data);
      setStatus(`✅ Loaded ${data.length} validation rules`);
    } catch (e) {
      setStatus("❌ Error: " + e.message);
    }
    setLoading(false);
  };

  const toggleRule = (ruleId, currentActive) => {
    setRules(rules.map((r) =>
      r.Id === ruleId ? { ...r, Active: !currentActive, _pending: true } : r
    ));
    setStatus("⏳ Changes pending — click Deploy to save to Salesforce");
  };

  const toggleAll = (activate) => {
    setRules(rules.map((r) => ({ ...r, Active: activate, _pending: true })));
    setStatus("⏳ Changes pending — click Deploy to save to Salesforce");
  };

  const deployChanges = async () => {
    setDeploying(true);
    setStatus("🚀 Deploying changes to Salesforce...");
    let success = 0;
    let failed = 0;
    for (const rule of rules) {
      if (rule._pending) {
        const ok = await toggleValidationRule(rule.Id, rule.Active);
        if (ok) success++;
        else failed++;
      }
    }
    setRules(rules.map(({ _pending, ...r }) => r));
    setStatus(`✅ Deployed! ${success} updated${failed ? `, ${failed} failed` : ""}`);
    setDeploying(false);
  };

  const logout = () => {
    localStorage.clear();
    setAuth({});
    navigate("/");
  };

  const hasPending = rules.some((r) => r._pending);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9" }}>
      {/* Header */}
      <div style={{
        background: "#0070d2", color: "#fff",
        padding: "16px 32px", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: "20px" }}>⚡ Salesforce Validation Rule Manager</h1>
        <button onClick={logout} style={{
          background: "rgba(255,255,255,0.2)", color: "#fff",
          border: "1px solid rgba(255,255,255,0.4)", borderRadius: "6px",
          padding: "8px 16px", cursor: "pointer", fontSize: "14px"
        }}>
          Logout
        </button>
      </div>

      <div style={{ maxWidth: "1000px", margin: "32px auto", padding: "0 16px" }}>
        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
          <button onClick={fetchRules} disabled={loading} style={btn("#0070d2")}>
            {loading ? "Loading..." : "📋 Get Validation Rules"}
          </button>
          <button onClick={() => toggleAll(true)} disabled={!rules.length} style={btn("#27ae60")}>
            ✅ Enable All
          </button>
          <button onClick={() => toggleAll(false)} disabled={!rules.length} style={btn("#e67e22")}>
            🚫 Disable All
          </button>
          <button onClick={deployChanges} disabled={!hasPending || deploying} style={btn("#8e44ad")}>
            {deploying ? "Deploying..." : "🚀 Deploy Changes"}
          </button>
        </div>

        {/* Status */}
        {status && (
          <div style={{
            background: "#fff", border: "1px solid #ddd",
            borderRadius: "8px", padding: "12px 16px",
            marginBottom: "20px", color: "#333", fontSize: "14px"
          }}>
            {status}
          </div>
        )}

        {/* Table */}
        <ValidationRuleList rules={rules} onToggle={toggleRule} />
      </div>
    </div>
  );
}

const btn = (bg) => ({
  padding: "10px 20px", background: bg, color: "#fff",
  border: "none", borderRadius: "6px", cursor: "pointer",
  fontSize: "14px", fontWeight: "600",
  opacity: 1,
});