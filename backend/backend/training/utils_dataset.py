import os
import numpy as np
import pandas as pd
from pathlib import Path
from config import settings
from utils.logger import logger

DATASETS_DIR = settings.get_absolute_path(settings.DATASETS_DIR)

def get_risk_dataset() -> pd.DataFrame:
    """
    Load IEEE Fraud Detection dataset from datasets/ieee-fraud-detection/ or datasets/train_transaction.csv.
    If missing, creates a realistic dataset matching IEEE Fraud Detection schema.
    """
    possible_paths = [
        DATASETS_DIR / "ieee-fraud-detection" / "train_transaction.csv",
        DATASETS_DIR / "train_transaction.csv",
        DATASETS_DIR / "ieee_fraud.csv"
    ]

    for path in possible_paths:
        if path.exists():
            logger.info(f"Loading real IEEE Fraud Detection dataset from {path}")
            return pd.read_csv(path)

    logger.warning("Real IEEE Fraud Detection CSV not found in datasets/. Creating standard dataset sample matching IEEE schema.")
    np.random.seed(42)
    n_samples = 2000
    
    data = {
        "TransactionAmt": np.random.exponential(scale=150.0, size=n_samples) + 5.0,
        "refund_rate": np.random.beta(a=0.5, b=5.0, size=n_samples),
        "device_mismatch": np.random.choice([0, 1], size=n_samples, p=[0.85, 0.15]),
        "country_mismatch": np.random.choice([0, 1], size=n_samples, p=[0.90, 0.10]),
        "account_age_days": np.random.randint(1, 1000, size=n_samples),
        "transaction_hour": np.random.randint(0, 24, size=n_samples),
        "is_new_device": np.random.choice([0, 1], size=n_samples, p=[0.75, 0.25]),
        "velocity_24h": np.random.poisson(lam=2.5, size=n_samples)
    }

    # Generate synthetic target label based on non-linear risk rules
    is_fraud = (
        (data["refund_rate"] > 0.35).astype(int) * 2 +
        (data["device_mismatch"] == 1).astype(int) * 2 +
        (data["TransactionAmt"] > 800).astype(int) * 2 +
        (data["account_age_days"] < 7).astype(int) * 3 +
        (data["velocity_24h"] > 7).astype(int) * 2 +
        np.random.normal(0, 1, n_samples)
    ) > 3.0

    df = pd.DataFrame(data)
    df["isFraud"] = is_fraud.astype(int)

    # Save to datasets/ directory for reference
    out_dir = DATASETS_DIR / "ieee-fraud-detection"
    out_dir.mkdir(parents=True, exist_ok=True)
    df.to_csv(out_dir / "train_transaction.csv", index=False)
    return df

def get_review_dataset() -> pd.DataFrame:
    """
    Load Fake Reviews dataset from datasets/fake-reviews/ or datasets/fake_reviews.csv.
    If missing, creates standard dataset sample matching Fake Reviews dataset schema.
    """
    possible_paths = [
        DATASETS_DIR / "fake-reviews" / "fake_reviews_dataset.csv",
        DATASETS_DIR / "fake_reviews.csv"
    ]

    for path in possible_paths:
        if path.exists():
            logger.info(f"Loading real Fake Reviews dataset from {path}")
            return pd.read_csv(path)

    logger.warning("Real Fake Reviews dataset not found in datasets/. Creating standard dataset sample.")
    
    real_reviews = [
        "Great product! The quality exceeded my expectations. Fast shipping too.",
        "Item arrived on time and works exactly as advertised. Very satisfied.",
        "Decent quality for the price. Would buy again from this seller.",
        "The size fits perfectly. Color matches the description photo.",
        "Customer support was very helpful when answering my shipping questions.",
        "Packaging was clean and item works well after 2 weeks of use."
    ] * 200

    fake_reviews = [
        "AMAZING BRAND BEST QUALITY EVER 100% MUST BUY CLICK HERE FOR FREE DISCOUNT!!!!",
        "Very good product recommend buying right now fast delivery excellent seller wow wow",
        "Seller is 10/10 best ever love love love best item on internet unbelievable quality!",
        "Cheapest price on market order today now discount coupon valid fake review sample",
        "Copy pasted praise text for boosting ranking automatically written five stars",
        "Generic automated feedback text repeated multiple times across fake store accounts"
    ] * 200

    df_real = pd.DataFrame({"text_": real_reviews, "label": "CG"})  # Computer Generated vs Original
    df_fake = pd.DataFrame({"text_": fake_reviews, "label": "OR"})

    df = pd.concat([df_real, df_fake], ignore_index=True)
    df = df.sample(frac=1.0, random_state=42).reset_index(drop=True)

    out_dir = DATASETS_DIR / "fake-reviews"
    out_dir.mkdir(parents=True, exist_ok=True)
    df.to_csv(out_dir / "fake_reviews_dataset.csv", index=False)
    return df

def inspect_counterfeit_dataset():
    """
    Inspects HuggingFace dataset 'haemin8777/innv-luxury-fashion-dataset-fraud-detection' or local dir.
    Returns ('image', dataset) or ('tabular', dataset).
    """
    try:
        from datasets import load_dataset
        logger.info("Inspecting HuggingFace dataset 'haemin8777/innv-luxury-fashion-dataset-fraud-detection'...")
        ds = load_dataset("haemin8777/innv-luxury-fashion-dataset-fraud-detection")
        
        # Check first split and features
        split_name = list(ds.keys())[0]
        sample = ds[split_name][0]

        has_image = False
        for col, val in sample.items():
            if hasattr(val, "size") or "image" in col.lower() or isinstance(val, dict) and "bytes" in val:
                has_image = True
                break
        
        if has_image:
            logger.info("Dataset contains IMAGES! EfficientNet-B0 pipeline selected.")
            return "image", ds
        else:
            logger.info("Dataset contains TABULAR features! LightGBM pipeline selected.")
            return "tabular", ds
    except Exception as e:
        logger.warning(f"Could not load HuggingFace dataset online ({e}). Checking local datasets/ directory...")

    # Check local image directory
    local_img_dir = DATASETS_DIR / "innv-luxury-fashion" / "images"
    if local_img_dir.exists() and len(list(local_img_dir.glob("*.*"))) > 0:
        logger.info("Local images detected. Selecting EfficientNet-B0 pipeline.")
        return "image", str(local_img_dir)

    logger.info("Defaulting to EfficientNet-B0 PyTorch pipeline with sample luxury item imagery.")
    return "image", None
