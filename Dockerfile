FROM node:26.1.0-slim

RUN groupadd -r nonroot \
    && useradd -r -g nonroot nonroot \
    && mkdir -p /app && chown -R nonroot:nonroot /app

WORKDIR /app

COPY node_modules ./node_modules

USER nonroot

# bundled JS from `pnpm run build:dev` (rolldown)
COPY ./dist .

EXPOSE 3000

CMD [ "node", "bundle.js" ]
