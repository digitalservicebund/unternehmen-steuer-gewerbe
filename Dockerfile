FROM node:25.8.1-alpine

# make the 'app' folder the current working directory
WORKDIR /frontend

# Install pnpm
RUN npm install -g pnpm

# copy both 'package.json5' and 'pnpm-lock.yaml'
COPY package.json5 pnpm-lock.yaml ./

# install project dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY ./src .
COPY tsconfig.json .

# build app for production with minification
RUN pnpm run build

EXPOSE 3000
CMD [ "pnpm", "run", "start" ]
