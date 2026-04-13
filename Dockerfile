FROM node:25.9.0-alpine3.23

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot \
    && mkdir -p /app && chown -R nonroot:nonroot /app

USER nonroot

WORKDIR /app

# bundle created by `npm run build`, which uses rolldown for bundling
COPY --chown=root:root --chmod=755 ./dist/bundle.js .

EXPOSE 3000

CMD [ "node", "bundle.js" ]
