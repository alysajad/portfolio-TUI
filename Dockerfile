# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
COPY content/ ./content/

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY --from=builder /app/dist/ ./dist/
COPY content/ ./content/
COPY src/ascii/ ./src/ascii/

# Generate host key at build time
RUN apk add --no-cache openssh-keygen && \
    ssh-keygen -t rsa -b 4096 -f host_key -N "" && \
    apk del openssh-keygen

# Render uses the PORT environment variable to map incoming traffic
ENV PORT=10000
EXPOSE 10000

CMD ["node", "dist/server.js"]
