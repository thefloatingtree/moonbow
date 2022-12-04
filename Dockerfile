FROM node:16

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE 5000
EXPOSE 8080
CMD ["yarn", "prod"]