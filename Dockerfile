FROM cgr.dev/chainguard/node@sha256:30bac16e19a580ed7feb991876e89d45f96eead87518df4bce46e597336c6a18

WORKDIR /app

COPY node_modules ./node_modules

# bundled JS from `pnpm run build:dev` (rolldown)
COPY ./dist .

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
ENV RESOURCES_DIR=/app/resources
ENV LD_LIBRARY_PATH=/app/ERiC-44.2.4.0/Linux-x86_64/lib
ENV NODE_OPTIONS="--max-old-space-size=200"

EXPOSE 3000

CMD [ "bundle.mjs" ]
