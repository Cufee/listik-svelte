FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .

ENV NODE_ENV=production

RUN bun run build

ENTRYPOINT [ "bun", "/app/build/index.js" ]