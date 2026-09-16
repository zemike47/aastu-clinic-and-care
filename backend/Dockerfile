FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]