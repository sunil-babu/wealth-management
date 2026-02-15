# Deployment checklist for GCP Cloud Run

## Pre-Deployment

- [ ] GCP Project created and billing enabled
- [ ] Cloud Run API enabled: `gcloud services enable run.googleapis.com`
- [ ] Vertex AI API enabled: `gcloud services enable aiplatform.googleapis.com`
- [ ] Artifact Registry enabled: `gcloud services enable artifactregistry.googleapis.com`
- [ ] Service account created with Vertex AI permissions
- [ ] Workload Identity configured for Cloud Run

## Build & Push

```bash
# Build container
docker build -f Dockerfile.prod -t gcr.io/${PROJECT_ID}/wealth-mgmt:latest .

# Configure Docker auth (one time)
gcloud auth configure-docker gcr.io

# Push
docker push gcr.io/${PROJECT_ID}/wealth-mgmt:latest
```

## Deploy to Cloud Run

```bash
gcloud run deploy wealth-mgmt \
  --image gcr.io/${PROJECT_ID}/wealth-mgmt:latest \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60s \
  --concurrency 100 \
  --max-instances 10 \
  --set-env-vars GOOGLE_CLOUD_PROJECT=${PROJECT_ID},VERTEX_API_URL=... \
  --service-account wealth-mgmt@${PROJECT_ID}.iam.gserviceaccount.com \
  --allow-unauthenticated
```

## Enable CI/CD with Cloud Build

```bash
# Connect GitHub repo and set up build trigger
gcloud builds connect --repository-name wealth-mgmt --repository-owner YOUR_GITHUB_USERNAME

# Deploy cloudbuild.yaml
gcloud builds submit --config cloudbuild.yaml
```

## Monitoring & Troubleshooting

```bash
# View logs
gcloud run services logs read wealth-mgmt --limit 50

# Check deployment status
gcloud run services describe wealth-mgmt --region us-central1

# Stream live logs
gcloud run services logs read wealth-mgmt --follow

# Set alerts for errors
gcloud monitoring alert-policies create --notification-channels=CHANNEL_ID \
  --display-name="Wealth-MGMT Errors" \
  --condition-display-name="High error rate"
```

## Cost Monitoring

- Cloud Storage for Container Registry: ~$0.026/GB
- Cloud Run: ~$0.000025 per request + runtime (free tier: 2M requests/month)
- Vertex AI: "Pay-as-you-go" for API calls
- Recommendation: Set billing alerts at $50/month

## Rollback

```bash
# List revisions
gcloud run revisions list --service wealth-mgmt --region us-central1

# Rollback to previous
gcloud run services update-traffic wealth-mgmt --to-revisions=REVISION_NAME=100
```

## Scheduled Tasks (if needed)

Use Cloud Scheduler to trigger background jobs:

```bash
gcloud scheduler jobs create http daily-analysis \
  --schedule="0 2 * * *" \
  --http-method=POST \
  --uri=https://YOUR_CLOUD_RUN_URL/api/vertex \
  --message-body='{"prompt":"Generate daily portfolio summary"}'
```
