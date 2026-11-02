FROM cgr.dev/chainguard/node@sha256:c7b5d6aab019deb6cf69e66c06c28cfeafdf8dfc138c3c13403d500f82e9b5bf

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
