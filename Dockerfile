FROM oven/bun

WORKDIR /app

COPY . .

RUN bun install
RUN bun run nest:build

ENV HOST=0.0.0.0
ENV PORT=3001

EXPOSE 3001

CMD ["bun", "./dist/index.js"]
