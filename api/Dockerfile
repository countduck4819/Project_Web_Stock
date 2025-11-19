# ===========================
# Stage 1: Build NestJS
# ===========================
FROM node:22-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the source code
COPY . .

# Build NestJS into dist/
RUN npm run build



# ===========================
# Stage 2: Run NestJS
# ===========================
FROM node:22-slim AS runner

WORKDIR /app

# Copy package files for production install
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy compiled build
COPY --from=builder /app/dist ./dist

# Copy JSON data folders (your volumes in docker-compose)
COPY --from=builder /app/data ./data
COPY --from=builder /app/predict_xgboost_and_lstm ./predict_xgboost_and_lstm

# Expose app port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
