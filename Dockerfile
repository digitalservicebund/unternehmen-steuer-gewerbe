FROM cgr.dev/chainguard/node@sha256:6ec35d87faf19dab94214bd8ccd38785a72cf3de02946044a196df1689311376

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
