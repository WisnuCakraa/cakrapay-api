FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["sh", "-c", "ls -la dist/ && npx prisma migrate deploy && node dist/server.js"]