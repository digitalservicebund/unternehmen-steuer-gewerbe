FROM cgr.dev/chainguard/node@sha256:a43b3727ec02182f0e8034a63a6643fa56086e18610859abc3968596a4d12582

WORKDIR /app

COPY node_modules ./node_modules

# bundled JS from `pnpm run build:dev` (rolldown)
COPY ./dist .

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
ENV RESOURCES_DIR=/app/resources
ENV LD_LIBRARY_PATH=/app/node_modules/unternehmen-steuer-gewerbe-privat/dist/ERiC-43.4.6.0/Linux-x86_64/lib

EXPOSE 3000

CMD [ "bundle.mjs" ]
