FROM node:20-alpine 
 # or node:20

WORKDIR /app

# No need to upgrade npm manually, this image already supports npm 11+
COPY package.json package-lock.json* ./
RUN npm install

COPY . .
CMD ["npm", "start"]
