const PROXY = "https://corsproxy.io/?";

const proxify = (url) => `${PROXY}${encodeURIComponent(url)}`;

export const SF_AUTH_URL = () => {
  const params = new URLSearchParams({
    response_type: "token",
    client_id: process.env.REACT_APP_SF_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_SF_REDIRECT_URI,
    scope: "full refresh_token",
  });
  return `${process.env.REACT_APP_SF_LOGIN_URL}/services/oauth2/authorize?${params}`;
};

export const getValidationRules = async (instanceUrl, accessToken) => {
  const query = `SELECT Id, ValidationName, Active, Description FROM ValidationRule WHERE EntityDefinition.QualifiedApiName = 'Account'`;
  const url = `${instanceUrl}/services/data/v59.0/tooling/query?q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(proxify(url), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.errorCode) throw new Error(data.message);
    return data.records;
  } catch (e) {
    // Try alternative proxy
    const res2 = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data2 = await res2.json();
    if (data2.errorCode) throw new Error(data2.message);
    return data2.records;
  }
};

export const getValidationRuleDetail = async (instanceUrl, accessToken, ruleId) => {
  const url = `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${ruleId}`;
  const res = await fetch(proxify(url), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return await res.json();
};

export const toggleValidationRule = async (instanceUrl, accessToken, ruleId, isActive) => {
  try {
    const detail = await getValidationRuleDetail(instanceUrl, accessToken, ruleId);
    const existingMetadata = detail.Metadata || {};

    const url = `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${ruleId}`;

    const res = await fetch(proxify(url), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Metadata: {
          ...existingMetadata,
          active: isActive,
        },
      }),
    });

    console.log("Status:", res.status);
    return res.ok || res.status === 204 || res.status === 200;
  } catch (e) {
    console.error("Toggle error:", e);
    return false;
  }
};