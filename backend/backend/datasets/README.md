# Datasets Directory

This directory stores datasets for training the multi-agent fraud detection models:

1. **IEEE Fraud Detection (Agent 1 - Risk Scoring)**
   - Expects `train_transaction.csv` and `train_identity.csv` (or `ieee_fraud_detection.csv`) in `datasets/ieee-fraud-detection/`.
   - Download from: https://www.kaggle.com/c/ieee-fraud-detection

2. **Fake Reviews Dataset (Agent 2 - Review Moderation)**
   - Expects `fake_reviews_dataset.csv` in `datasets/fake-reviews/`.
   - Download from: https://www.kaggle.com/datasets/thearijitdas/fake-reviews-dataset

3. **Luxury Fashion Counterfeit Dataset (Agent 3 - Counterfeit Detection)**
   - Expects images or tabular dataset in `datasets/innv-luxury-fashion/` or automatically fetched via HuggingFace hub `haemin8777/innv-luxury-fashion-dataset-fraud-detection`.
   - Download from: https://huggingface.co/datasets/haemin8777/innv-luxury-fashion-dataset-fraud-detection

Note: Running the training scripts (`python -m training.train_risk`, etc.) will attempt to download or inspect these directories, and will automatically fall back to downloading or creating standard dataset samples if local files are missing.
