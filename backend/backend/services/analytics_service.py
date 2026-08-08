from schemas.analytics_schemas import AnalyticsResponse, AgentPerformanceMetric
from services.audit_service import audit_service

class AnalyticsService:
    def get_analytics(self) -> AnalyticsResponse:
        logs_response = audit_service.get_logs(limit=500)
        logs = logs_response.logs

        total_requests = len(logs)
        high_risk_tx = 0
        fake_reviews = 0
        counterfeits = 0

        risk_dist = {"Low": 0, "Medium": 0, "High": 0}
        
        agent_stats = {
            "Risk Scoring": {"scans": 0, "flagged": 0, "conf_sum": 0.0},
            "Review Moderation": {"scans": 0, "flagged": 0, "conf_sum": 0.0},
            "Counterfeit Detection": {"scans": 0, "flagged": 0, "conf_sum": 0.0},
        }

        for entry in logs:
            agent = entry.agentName
            output = entry.outputSummary
            
            if agent == "Risk Scoring":
                agent_stats["Risk Scoring"]["scans"] += 1
                risk_level = output.get("riskLevel", "Low")
                risk_dist[risk_level] = risk_dist.get(risk_level, 0) + 1
                if risk_level == "High":
                    high_risk_tx += 1
                    agent_stats["Risk Scoring"]["flagged"] += 1
                agent_stats["Risk Scoring"]["conf_sum"] += float(output.get("confidence", 0.0))

            elif agent == "Review Moderation":
                agent_stats["Review Moderation"]["scans"] += 1
                if output.get("spam", False) or float(output.get("fakeProbability", 0.0)) > 50.0:
                    fake_reviews += 1
                    agent_stats["Review Moderation"]["flagged"] += 1
                agent_stats["Review Moderation"]["conf_sum"] += float(output.get("fakeProbability", 0.0))

            elif agent == "Counterfeit Detection":
                agent_stats["Counterfeit Detection"]["scans"] += 1
                if output.get("prediction") == "Counterfeit":
                    counterfeits += 1
                    agent_stats["Counterfeit Detection"]["flagged"] += 1
                agent_stats["Counterfeit Detection"]["conf_sum"] += float(output.get("confidence", 0.0))

        metrics_breakdown = {}
        for key, data in agent_stats.items():
            scans = data["scans"]
            flagged = data["flagged"]
            conf_sum = data["conf_sum"]
            metrics_breakdown[key] = AgentPerformanceMetric(
                totalScans=scans,
                flaggedFraud=flagged,
                fraudPercentage=round((flagged / scans * 100.0), 1) if scans > 0 else 0.0,
                avgConfidence=round((conf_sum / scans), 1) if scans > 0 else 0.0
            )

        return AnalyticsResponse(
            totalRequests=total_requests,
            highRiskTransactions=high_risk_tx,
            fakeReviewsDetected=fake_reviews,
            counterfeitsFlagged=counterfeits,
            agentMetrics=metrics_breakdown,
            riskDistribution=risk_dist
        )

analytics_service = AnalyticsService()
