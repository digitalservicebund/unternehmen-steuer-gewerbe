FROM cgr.dev/chainguard/node@sha256:fe7b5c68d9d693acf191ef39f2e71b7c09c2f9474cc2a72a97ed09fd473c2743

WORKDIR /app

COPY node_modules ./node_modules

# bundled JS from `pnpm run build:dev` (rolldown)
COPY ./dist .

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA
ENV RESOURCES_DIR=/app/resources
ENV LD_LIBRARY_PATH=/app/ERiC-43.4.6.0/Linux-x86_64/lib

EXPOSE 3000

CMD [ "bundle.mjs" ]
