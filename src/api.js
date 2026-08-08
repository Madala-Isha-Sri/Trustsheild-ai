const API_URL = "http://localhost:8000";


// Agent 1 - Risk Scoring
export const checkRiskScore = async (data) => {
  const response = await fetch(`${API_URL}/risk-score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
};


// Agent 2 - Review Analysis
export const analyzeReview = async (data) => {
  const response = await fetch(`${API_URL}/review-analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
};


// Agent 3 - Counterfeit Detection
export const detectCounterfeit = async (file, tabularData) => {

  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "tabular_data",
    JSON.stringify(tabularData)
  );


  const response = await fetch(
    `${API_URL}/counterfeit-detect`,
    {
      method: "POST",
      body: formData,
    }
  );

  return await response.json();
};


export default API_URL;