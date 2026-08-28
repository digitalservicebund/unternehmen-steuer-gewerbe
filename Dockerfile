FROM cgr.dev/chainguard/node@sha256:d6ca8dfc9d0a8f369cd86c0bb6a8f9e4b304b3bb12aaf8fd26bd1352e6b6efc1

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
