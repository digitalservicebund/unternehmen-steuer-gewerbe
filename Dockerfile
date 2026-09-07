FROM cgr.dev/chainguard/node@sha256:6b02b9b489f4246e507e2b8d9890238d3a2a0b8368da9191546d9e2bebe1bd7e

WORKDIR /app

COPY node_modules ./node_modules

# bundled JS from `pnpm run build:dev` (rolldown)
COPY ./dist .

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
ENV RESOURCES_DIR=/app/resources
ENV LD_LIBRARY_PATH=/app/ERiC-44.2.4.0/Linux-x86_64/lib
ENV NODE_OPTIONS="--max-old-space-size=300"

EXPOSE 3000

CMD [ "bundle.mjs" ]
