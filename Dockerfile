# =========================
# 1) Build NESTJS API
# =========================
FROM node:20 AS api-builder
WORKDIR /app/api
COPY api/package*.json ./
RUN npm install
COPY api .
RUN npm run build


# =========================
# 2) Build NEXT.JS WEB
# =========================
FROM node:20 AS web-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web .
RUN npm run build


# =========================
# 3) Build PYTHON SERVER
# =========================
FROM python:3.10-slim AS python-builder
WORKDIR /app/python
COPY python_data/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY python_data .


# =========================
# 4) FINAL IMAGE – CHẠY TẤT CẢ SERVICE
# =========================
FROM node:20

WORKDIR /app

# Copy API
COPY --from=api-builder /app/api ./api

# Copy NEXT WEB
COPY --from=web-builder /app/web ./web

# Copy Python code
COPY --from=python-builder /app/python ./python

# Copy data
COPY data ./data
COPY predict_xgboost_and_lstm ./predict_xgboost_and_lstm

# Install PM2 để chạy nhiều service
RUN npm install -g pm2

# Copy PM2 config
COPY ecosystem.config.js .

EXPOSE 3000 7000 6060

CMD ["pm2-runtime", "ecosystem.config.js"]
