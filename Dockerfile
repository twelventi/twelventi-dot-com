FROM node:20-alpine3.17

WORKDIR /app

COPY ./.yarnrc.yml /app/
COPY ./yarn.lock /app/
COPY .yarn/releases /app/.yarn/releases
COPY Dockerfile /app/
#I guess you run npm install w/o the code first
#not sure why but this is the pattern I've seen everywhere
COPY package.json package.json
COPY api/package*.json ./api/
COPY ui/package*.json ./ui/

RUN yarn install

#bundle app source
COPY api ./api
COPY ui ./ui
COPY ./tsconfig.json/ /app/

# npm rebuild esbuild -> https://stackoverflow.com/questions/69607736/vite-react-app-esbuild-error-in-docker-container
# has to do something w/ running on a mac and then in a docker container 
RUN yarn workspace ui rebuild esbuild && yarn workspace ui build && yarn workspace ui rebuild esbuild && yarn workspace api build

EXPOSE 3001
ENV PORT 3001

CMD ["node", "api/build/index.js"]

