import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

from config import settings
from training.utils_dataset import get_review_dataset
from utils.logger import logger

def train_review_model():
    logger.info("=" * 60)
    logger.info("STARTING TRAINING: Agent 2 - Review Moderation (TF-IDF + Logistic Regression)")
    logger.info("=" * 60)

    # 1. Load dataset
    df = get_review_dataset()
    logger.info(f"Dataset loaded with shape: {df.shape}")

    # Determine text and label columns
    text_col = "text_" if "text_" in df.columns else ("review" if "review" in df.columns else df.columns[0])
    label_col = "label" if "label" in df.columns else df.columns[1]

    # Map labels to binary (1 = Fake/CG/Spam, 0 = Real/OR)
    y_raw = df[label_col].astype(str)
    y = y_raw.apply(lambda val: 1 if val.strip().upper() in ["CG", "FAKE", "1", "TRUE", "SPAM"] else 0)
    X = df[text_col].fillna("").astype(str)

    # 2. Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    logger.info(f"Train samples: {len(X_train)}, Test samples: {len(X_test)}")

    # 3. Build TF-IDF + Logistic Regression Pipeline
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words="english")),
        ("clf", LogisticRegression(C=1.0, max_iter=500, random_state=42))
    ])

    pipeline.fit(X_train, y_train)

    # 4. Evaluate Model
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    try:
        auc = roc_auc_score(y_test, y_prob)
    except Exception:
        auc = 0.5

    logger.info("-" * 40)
    logger.info("AGENT 2 EVALUATION METRICS:")
    logger.info(f"Accuracy : {acc * 100:.2f}%")
    logger.info(f"Precision: {prec * 100:.2f}%")
    logger.info(f"Recall   : {rec * 100:.2f}%")
    logger.info(f"F1 Score : {f1 * 100:.2f}%")
    logger.info(f"ROC-AUC  : {auc:.4f}")
    logger.info("-" * 40)

    # 5. Save Artifact
    output_path = settings.get_absolute_path(settings.REVIEW_MODEL_PATH)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    joblib.dump(pipeline, output_path)
    logger.info(f"SUCCESS: Review moderation model saved to {output_path}")
    logger.info("=" * 60)

if __name__ == "__main__":
    train_review_model()
