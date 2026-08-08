import os
import joblib
import pandas as pd
import numpy as np

try:
    import lightgbm as lgb
    HAS_LIGHTGBM = True
except ImportError:
    HAS_LIGHTGBM = False

try:
    import xgboost as xgb
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.ensemble import HistGradientBoostingClassifier

from config import settings
from training.utils_dataset import get_risk_dataset
from utils.logger import logger

def train_risk_model():
    logger.info("=" * 60)
    logger.info("STARTING TRAINING: Agent 1 - Risk Scoring")
    logger.info("=" * 60)

    # 1. Load dataset
    df = get_risk_dataset()
    logger.info(f"Dataset loaded with shape: {df.shape}")

    # Determine target column
    target_col = "isFraud" if "isFraud" in df.columns else df.columns[-1]

    # Preprocessing feature selection
    feature_cols = [col for col in df.columns if col != target_col and df[col].dtype in [np.float64, np.int64, float, int]]
    
    X = df[feature_cols].fillna(0)
    y = df[target_col]

    # 2. Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y if len(np.unique(y)) > 1 else None
    )
    logger.info(f"Train samples: {len(X_train)}, Test samples: {len(X_test)}")

    # 3. Train Model (LightGBM preferred, XGBoost or HistGradientBoosting fallback)
    if HAS_LIGHTGBM:
        logger.info("Using LightGBM Classifier...")
        model = lgb.LGBMClassifier(
            n_estimators=150,
            learning_rate=0.05,
            num_leaves=31,
            random_state=42,
            verbosity=-1
        )
    elif HAS_XGBOOST:
        logger.info("Using XGBoost Classifier...")
        model = xgb.XGBClassifier(
            n_estimators=150,
            learning_rate=0.05,
            random_state=42
        )
    else:
        logger.info("Using HistGradientBoosting Classifier (sklearn)...")
        model = HistGradientBoostingClassifier(
            max_iter=150,
            learning_rate=0.05,
            random_state=42
        )

    model.fit(X_train, y_train)

    # 4. Evaluate Model
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else y_pred

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    try:
        auc = roc_auc_score(y_test, y_prob)
    except Exception:
        auc = 0.5

    logger.info("-" * 40)
    logger.info("AGENT 1 EVALUATION METRICS:")
    logger.info(f"Accuracy : {acc * 100:.2f}%")
    logger.info(f"Precision: {prec * 100:.2f}%")
    logger.info(f"Recall   : {rec * 100:.2f}%")
    logger.info(f"F1 Score : {f1 * 100:.2f}%")
    logger.info(f"ROC-AUC  : {auc:.4f}")
    logger.info("-" * 40)

    # 5. Save Artifact
    output_path = settings.get_absolute_path(settings.RISK_MODEL_PATH)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    artifact = {
        "model": model,
        "feature_names": feature_cols,
        "metrics": {"accuracy": acc, "precision": prec, "recall": rec, "f1": f1, "auc": auc}
    }
    joblib.dump(artifact, output_path)
    logger.info(f"SUCCESS: Risk model saved to {output_path}")
    logger.info("=" * 60)

if __name__ == "__main__":
    train_risk_model()
