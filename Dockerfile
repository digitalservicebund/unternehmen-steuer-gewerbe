FROM cgr.dev/chainguard/node@sha256:105c8e7e503ea8f45553b9cc5aa0d24e80499bcc7c860dff54449e7c01d9be79

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
