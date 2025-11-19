FROM node:20-alpine AS builder

WORKDIR /app

# Copy toàn bộ project root (quan trọng để copy thư mục predict_xgboost_and_lstm)
COPY .. /app

# Cài npm trong folder api
WORKDIR /app/api
RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/api/dist ./dist
COPY --from=builder /app/predict_xgboost_and_lstm ./predict_xgboost_and_lstm

# Copy file .env nếu bạn muốn load từ file
# COPY --from=builder /app/.env .env

EXPOSE 3000
CMD ["node", "dist/main.js"]
