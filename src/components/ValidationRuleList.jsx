import React from "react";

export default function ValidationRuleList({ rules, onToggle }) {
  if (!rules.length) {
    return (
      <div style={{
        background: "#fff", borderRadius: "8px", padding: "48px",
        textAlign: "center", color: "#999", border: "1px solid #ddd"
      }}>
        <p style={{ fontSize: "18px" }}>No rules loaded yet</p>
        <p style={{ fontSize: "14px" }}>Click "Get Validation Rules" to fetch from Salesforce</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#0070d2", color: "#fff" }}>
            <th style={th}>#</th>
            <th style={th}>Rule Name</th>
            <th style={th}>Status</th>
            <th style={th}>Pending</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, index) => (
            <tr key={rule.Id} style={{
              borderBottom: "1px solid #eee",
              background: rule._pending ? "#fffbe6" : index % 2 === 0 ? "#fff" : "#fafafa"
            }}>
              <td style={td}>{index + 1}</td>
              <td style={{ ...td, fontWeight: "600", color: "#032d60" }}>{rule.ValidationName}</td>
              <td style={td}>
                <span style={{
                  padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600",
                  background: rule.Active ? "#e6f4ea" : "#fce8e6",
                  color: rule.Active ? "#1e7e34" : "#c62828"
                }}>
                  {rule.Active ? "🟢 Active" : "🔴 Inactive"}
                </span>
              </td>
              <td style={td}>
                {rule._pending ? (
                  <span style={{ color: "#f39c12", fontWeight: "600", fontSize: "13px" }}>⏳ Pending</span>
                ) : (
                  <span style={{ color: "#999", fontSize: "13px" }}>—</span>
                )}
              </td>
              <td style={td}>
                <button
                  onClick={() => onToggle(rule.Id, rule.Active)}
                  style={{
                    padding: "6px 16px", borderRadius: "4px", border: "none",
                    cursor: "pointer", fontWeight: "600", fontSize: "13px",
                    background: rule.Active ? "#fce8e6" : "#e6f4ea",
                    color: rule.Active ? "#c62828" : "#1e7e34",
                  }}
                >
                  {rule.Active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "14px 16px", textAlign: "left", fontWeight: "600" };
const td = { padding: "12px 16px" };