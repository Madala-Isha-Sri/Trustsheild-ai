import json
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def run_tests():
    print("==================================================")
    print("RUNNING FASTAPI BACKEND INTEGRATION TESTS")
    print("==================================================")

    # 1. Root & Health
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.text}"
    print("[PASS] GET / Root status:", r.status_code, r.json()["service"])

    r = client.get("/health")
    assert r.status_code == 200, f"Health failed: {r.text}"
    print("[PASS] GET /health status:", r.status_code, r.json()["status"])

    # 2. Agent 1: Risk Scoring
    risk_payload = {
        "transactionAmount": 1450.0,
        "cardType": "visa",
        "deviceMismatch": True,
        "countryMismatch": True,
        "refundRate": 0.45,
        "accountAgeDays": 3,
        "transactionHour": 2,
        "isNewDevice": True,
        "velocityCount24h": 10
    }
    r = client.post("/risk-score", json=risk_payload)
    assert r.status_code == 200, f"Risk score failed: {r.text}"
    risk_res = r.json()
    print("[PASS] POST /risk-score response:")
    print(json.dumps(risk_res, indent=2))
    assert "riskScore" in risk_res
    assert "riskLevel" in risk_res
    assert "confidence" in risk_res
    assert "reason" in risk_res

    # 3. Agent 2: Review Moderation
    review_payload = {
        "reviewText": "AMAZING PRODUCT MUST BUY RIGHT NOW CLICK HERE FOR FREE DISCOUNT 100% BEST PROMO ITEM",
        "rating": 5.0,
        "userVerified": False,
        "userTotalReviews": 1
    }
    r = client.post("/review-analysis", json=review_payload)
    assert r.status_code == 200, f"Review analysis failed: {r.text}"
    review_res = r.json()
    print("[PASS] POST /review-analysis response:")
    print(json.dumps(review_res, indent=2))
    assert "fakeProbability" in review_res
    assert "spam" in review_res
    assert "sentiment" in review_res

    # 4. Agent 3: Counterfeit Detection (Tabular)
    counterfeit_payload = {
        "brand": "Gucci",
        "priceUSD": 45.0,
        "originalMSRP": 2200.0,
        "sellerRating": 1.5,
        "serialNumberProvided": False,
        "materialQualityScore": 0.2
    }
    r = client.post("/counterfeit-detect", json=counterfeit_payload)
    assert r.status_code == 200, f"Counterfeit detect failed: {r.text}"
    counterfeit_res = r.json()
    print("[PASS] POST /counterfeit-detect response:")
    print(json.dumps(counterfeit_res, indent=2))
    assert "prediction" in counterfeit_res
    assert "confidence" in counterfeit_res

    # 5. Analytics & Audit Logs
    r = client.get("/analytics")
    assert r.status_code == 200, f"Analytics failed: {r.text}"
    analytics_res = r.json()
    print("[PASS] GET /analytics response:")
    print(json.dumps(analytics_res, indent=2))

    r = client.get("/audit-logs")
    assert r.status_code == 200, f"Audit logs failed: {r.text}"
    audit_res = r.json()
    print(f"[PASS] GET /audit-logs response: Total Logs={audit_res['totalLogs']}")

    print("==================================================")
    print("ALL INTEGRATION TESTS PASSED PERFECTLY!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
