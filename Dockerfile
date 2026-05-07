FROM oven/bun

WORKDIR /app

COPY . .

RUN bun install
RUN bun run nest:build

ENV HOST=0.0.0.0
ENV PORT=3002

EXPOSE 3002

CMD ["bun", "./dist/index.js"]
