# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- Production Runtime Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev

# Install sqlite3 native dependencies safely inside alpine
RUN apk add --no-cache python3 make g++ 

COPY --from=builder /app/src ./src

EXPOSE 3000
CMD ["npm", "start"]