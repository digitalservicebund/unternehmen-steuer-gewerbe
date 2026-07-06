FROM cgr.dev/chainguard/node@sha256:955b52dd59f8a73419fe1931e13a9b9eb822e7e5fda21ca754688b55753ea6ca

WORKDIR /app

COPY node_modules ./node_modules

# bundled JS from `pnpm run build:dev` (rolldown)
COPY ./dist .

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
ENV RESOURCES_DIR=/app/resources
ENV LD_LIBRARY_PATH=/app/ERiC-43.4.6.0/Linux-x86_64/lib
ENV NODE_OPTIONS="--max-old-space-size=200"

EXPOSE 3000

CMD [ "bundle.mjs" ]
