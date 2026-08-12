# ---------------------------------------------------------
# Builder Stage: React/Vite Frontend
# ---------------------------------------------------------
FROM docker.io/node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------------------------------------------------------
# Production Stage: Nginx + FastAPI (Multi-container setup via Podman)
# 
# NOTE: In a true Kubernetes/Rancher environment, you would deploy
# the frontend and backend as separate pods. This Dockerfile represents
# the Frontend container, while the backend would use its own Python image.
# ---------------------------------------------------------
FROM docker.io/nginx:alpine AS frontend-production
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ---------------------------------------------------------
# Backend Image for Rancher Deployment
# ---------------------------------------------------------
# FROM docker.io/python:3.11-slim AS backend-production
# WORKDIR /app
# COPY backend/requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
# COPY backend/ .
# EXPOSE 8000
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
