FROM cgr.dev/chainguard/node@sha256:381ba71f0fff9a91e7bccfc5260eeb626723563e7eeb710882861c4e641ad992

WORKDIR /app

COPY node_modules ./node_modules

# bundled JS from `pnpm run build:dev` (rolldown)
COPY ./dist .

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
ENV RESOURCES_DIR=/app/resources
ENV LD_LIBRARY_PATH=/app/ERiC-44.2.4.0/Linux-x86_64/lib
ENV NODE_OPTIONS="--max-old-space-size=128"

EXPOSE 3000

CMD [ "bundle.mjs" ]
