// src/services/api.ts

// Toggle this to false if your FastAPI backend is running and connected
const USE_MOCK_DATA = true;

const API_URL = "http://127.0.0.1:8000";

// --- Types ---
export interface RiskData {
  transactionAmount?: number;
  paymentType?: string;
  deviceId?: string;
  ipAddress?: string;
  [key: string]: any;
}

export interface ReviewData {
  reviewText?: string;
  rating?: number;
  [key: string]: any;
}

// --- API Functions ---

export async function calculateRisk(data: RiskData) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 180)); // Simulate 180ms latency
    const amount = Number(data.transactionAmount) || 0;
    const isHighRisk = amount > 2000 || (data.ipAddress && data.ipAddress.includes("VPN"));

    return {
      risk_score: isHighRisk ? 87.5 : 12.3,
      risk_level: isHighRisk ? "HIGH" : "LOW",
      decision: isHighRisk ? "FLAG_FOR_REVIEW" : "APPROVE",
      confidence: 0.94,
      latency_ms: 182,
      reasons: isHighRisk
        ? [
            "Transaction amount exceeds $2,000 threshold",
            "Anonymized VPN IP detected on checkout",
            "Device fingerprint mismatch across recent sessions"
          ]
        : ["Normal transaction pattern", "Trusted device fingerprint"],
      audit_hash: "0x8f9a2b71c4d"
    };
  }

  const response = await fetch(`${API_URL}/risk-score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Backend request failed");
  return response.json();
}

export async function analyzeReview(data: ReviewData) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 210));
    return {
      is_fake: true,
      bot_probability: 91.2,
      sentiment: "POSITIVE_ASTROTURFING",
      action: "HIDE_REVIEW",
      flags: ["Repetitive syntax pattern detected across 14 accounts", "Account created <24h ago"]
    };
  }

  const response = await fetch(`${API_URL}/review-analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Review moderation failed");
  return response.json();
}

export async function detectCounterfeit(formData: FormData) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 320));
    return {
      authenticity_score: 24.8,
      status: "COUNTERFEIT_SUSPECTED",
      recommended_action: "HOLD_LISTING",
      detected_anomalies: [
        "MSRP Mismatch: Listing price is 78% below official MSRP",
        "Vision Logo Check: Distorted stitching pattern around emblem"
      ]
    };
  }

  const response = await fetch(`${API_URL}/counterfeit-detect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Counterfeit detection failed");
  return response.json();
}

export async function getAnalytics() {
  if (USE_MOCK_DATA) {
    return {
      gmv_protected: "$1,420,500",
      fraud_reduction_pct: "38.2%",
      hold_precision: "97.4%",
      false_positive_rate: "0.08%",
      latency_avg_ms: 195
    };
  }

  const response = await fetch(`${API_URL}/analytics`);
  if (!response.ok) throw new Error("Failed to fetch analytics");
  return response.json();
}

export async function getAuditLogs() {
  if (USE_MOCK_DATA) {
    return [
      {
        id: "LOG-9021",
        timestamp: new Date().toISOString(),
        agent: "Risk Scoring Agent",
        decision: "FLAG_FOR_REVIEW",
        confidence: "94.2%",
        dpdp_compliant: true
      },
      {
        id: "LOG-9020",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        agent: "Authenticity Agent",
        decision: "HOLD_LISTING",
        confidence: "98.1%",
        dpdp_compliant: true
      }
    ];
  }

  const response = await fetch(`${API_URL}/audit-logs`);
  if (!response.ok) throw new Error("Failed to fetch audit logs");
  return response.json();
}