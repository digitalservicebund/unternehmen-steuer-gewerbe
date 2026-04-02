FROM node:25.8.2-alpine3.23

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

RUN mkdir -p /app && chown -R nonroot:nonroot /app

USER nonroot

WORKDIR /app

# bundle created by `npm run build`, which uses rolldown for bundling
COPY --chown=nonroot:nonroot ./dist/bundle.js .

EXPOSE 3000

# CMD [ "ls", "-la" ]
CMD [ "node", "bundle.js" ]
