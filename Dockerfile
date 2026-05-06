FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Expose port aplikasi
EXPOSE 3000

# Debug: cek isi dist/ sebelum jalankan server
CMD ["sh", "-c", "npx prisma migrate deploy; echo '=== Checking dist ==='; ls -la dist/; echo '=== Starting server ==='; node dist/server.js"]