# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# install dependencies first (use package-lock.json if present)
COPY package*.json ./
RUN npm ci --only=production

# copy app
COPY . .

# expose and start
ENV PORT=5000
EXPOSE 5000
CMD ["node", "index.js"]
