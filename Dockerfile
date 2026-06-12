# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# --- Production Runtime Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production

# Install sqlite3 native dependencies safely inside alpine
RUN apk add --no-cache python3 make g++ 

COPY --from=builder /app/src ./src

EXPOSE 3000
CMD ["npm", "start"]