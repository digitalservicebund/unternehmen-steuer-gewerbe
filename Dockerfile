FROM cgr.dev/chainguard/node@sha256:f83d27823d677f8425414121560ad70e349c16097e37c4029dfc347e97782bfb

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
