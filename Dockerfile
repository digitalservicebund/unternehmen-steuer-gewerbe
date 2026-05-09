FROM node:26.1.0-slim

RUN npm install -g pnpm@10.33.0 --ignore-scripts \
    && groupadd -r nonroot \
    && useradd -r -g nonroot nonroot \
    && mkdir -p /app && chown -R nonroot:nonroot /app

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

USER nonroot

# compiled JS from `pnpm run build` (tsc)
COPY ./dist .

EXPOSE 3000

CMD [ "node", "index.js" ]
