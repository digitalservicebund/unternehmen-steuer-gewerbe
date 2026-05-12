FROM node:26.1.0-slim

RUN groupadd -r nonroot \
    && useradd -r -g nonroot nonroot \
    && mkdir -p /app && chown -R nonroot:nonroot /app

WORKDIR /app

COPY node_modules ./node_modules

USER nonroot

# bundled JS from `pnpm run build:dev` (rolldown)
COPY ./dist .

ENV RESOURCES_DIR=/app/resources
ENV LD_LIBRARY_PATH=/app/node_modules/unternehmen-steuer-gewerbe-privat/dist/ERiC-43.4.6.0/Linux-x86_64/lib

EXPOSE 3000

CMD [ "node", "bundle.mjs" ]
