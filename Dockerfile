FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .

RUN bun run build

ENV NODE_ENV=production

ENTRYPOINT [ "bun", "/app/build/index.js" ]