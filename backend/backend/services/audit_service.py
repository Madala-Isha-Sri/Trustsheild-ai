import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
import threading

from config import settings
from schemas.audit_schemas import AuditLogEntry, AuditLogsResponse
from schemas.analytics_schemas import AnalyticsResponse, AgentPerformanceMetric
from utils.logger import logger

class AuditService:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(AuditService, cls).__new__(cls)
                    cls._instance._init_service()
        return cls._instance

    def _init_service(self):
        self.file_path = settings.get_absolute_path(settings.AUDIT_LOG_PATH)
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.file_path.exists():
            self._write_logs([])

    def _read_logs(self) -> List[Dict[str, Any]]:
        with self._lock:
            try:
                if self.file_path.exists():
                    with open(self.file_path, "r", encoding="utf-8") as f:
                        return json.load(f)
            except Exception as e:
                logger.error(f"Failed to read audit logs: {e}")
            return []

    def _write_logs(self, logs: List[Dict[str, Any]]):
        try:
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(logs, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to write audit logs: {e}")

    def log_event(
        self,
        agent_name: str,
        endpoint: str,
        input_summary: Dict[str, Any],
        output_summary: Dict[str, Any],
        execution_time_ms: float,
        status: str = "SUCCESS"
    ) -> AuditLogEntry:
        entry = AuditLogEntry(
            id=str(uuid.uuid4()),
            timestamp=datetime.utcnow().isoformat() + "Z",
            agentName=agent_name,
            endpoint=endpoint,
            inputSummary=input_summary,
            outputSummary=output_summary,
            executionTimeMs=round(execution_time_ms, 2),
            status=status
        )
        logs = self._read_logs()
        logs.insert(0, entry.model_dump())  # latest first
        if len(logs) > 500:  # keep last 500 entries
            logs = logs[:500]
        self._write_logs(logs)
        return entry

    def get_logs(self, limit: int = 50) -> AuditLogsResponse:
        raw_logs = self._read_logs()
        entries = [AuditLogEntry(**item) for item in raw_logs[:limit]]
        return AuditLogsResponse(totalLogs=len(raw_logs), logs=entries)

audit_service = AuditService()
