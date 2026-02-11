# Build stage
FROM node:22 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Runtime stage
FROM node:22-slim
WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000
CMD ["node", "./bin/www"]