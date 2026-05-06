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
CMD ["sh", "-c", "set -x; npx prisma migrate deploy; echo 'MIGRATE DONE'; echo '=== Checking dist ==='; ls -la /app/dist/ || echo 'NO DIST'; echo '=== Starting server ==='; node /app/dist/server.js || echo 'NODE FAILED'"]