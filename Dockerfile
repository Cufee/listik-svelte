FROM oven/bun:latest

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .

RUN bun run build

ENTRYPOINT [ "bun", "/app/build/index.js" ]