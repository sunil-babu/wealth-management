FROM node:18-alpine AS builder
WORKDIR /app

# Build client
COPY client/package.json client/package-lock.json ./client/
COPY client/ ./client/
WORKDIR /app/client
RUN npm ci
RUN npm run build

# Build server
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
COPY server/ ./server/
WORKDIR /app/server
RUN npm ci --production

# Final image
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./server/public
WORKDIR /usr/src/app/server
ENV PORT=8080
EXPOSE 8080
CMD ["node", "index.js"]
