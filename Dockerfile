FROM node:25.8.1-alpine

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

USER nonroot

# bundle created by `npm run build`, which uses rolldown for bundling
COPY ./dist/bundle.js .

EXPOSE 3000

# CMD [ "ls", "-la" ]
CMD [ "node", "bundle.js" ]
