const API_BASE = process.env.REACT_APP_PROXY_URL || "http://localhost:4000";

export const SF_AUTH_URL = () => {
  const params = new URLSearchParams({
    response_type: "token",
    client_id: process.env.REACT_APP_SF_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_SF_REDIRECT_URI,
    scope: "full refresh_token",
  });
  return `${process.env.REACT_APP_SF_LOGIN_URL}/services/oauth2/authorize?${params}`;
};

export const getValidationRules = async () => {
  const res = await fetch(`${API_BASE}/api/validation-rules`);
  const data = await res.json();
  if (data.errorCode) throw new Error(data.message);
  return data.records;
};

export const getValidationRuleDetail = async (ruleId) => {
  const res = await fetch(`${API_BASE}/api/validation-rules/${ruleId}`);
  return await res.json();
};

export const toggleValidationRule = async (ruleId, isActive) => {
  try {
    const detail = await getValidationRuleDetail(ruleId);
    const existingMetadata = detail.Metadata || {};

    const res = await fetch(`${API_BASE}/api/validation-rules/${ruleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Metadata: { ...existingMetadata, active: isActive },
      }),
    });
    return res.ok;
  } catch (e) {
    console.error("Toggle error:", e);
    return false;
  }
};