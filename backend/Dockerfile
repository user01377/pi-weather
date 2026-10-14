FROM node:22-alpine

WORKDIR /app/backend

ENV NODE_ENV=production

# Install backend dependencies
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source code
COPY backend/ ./

# Copy prebuilt React frontend
COPY frontend/dist/ /app/frontend/dist/

EXPOSE 8009

CMD ["node", "server.js"]
