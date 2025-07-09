# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --production

# Stage 2: Copy source and run
FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p /app/uploads/comprobantes
EXPOSE 5000
CMD ["node", "index.js"] 