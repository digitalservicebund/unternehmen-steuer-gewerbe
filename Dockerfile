FROM node:25.9.0-alpine3.23

RUN npm install -g pnpm@10.33.0 \
    && addgroup -S nonroot \
    && adduser -S nonroot -G nonroot \
    && mkdir -p /app && chown -R nonroot:nonroot /app

USER nonroot

WORKDIR /app

COPY package.json5 pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# compiled JS from `pnpm run build` (tsc)
COPY ./dist .

EXPOSE 3000

CMD [ "node", "index.js" ]
