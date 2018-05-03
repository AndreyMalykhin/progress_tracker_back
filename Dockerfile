FROM node:9.11.1-alpine as app
ARG PT_DIR_PATH
ARG PT_AVATARS_DIR_PATH
ARG PT_PORT
WORKDIR ${PT_DIR_PATH}
EXPOSE ${PT_PORT}
RUN mkdir -p ${PT_AVATARS_DIR_PATH}
RUN apk add --no-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/ \
  python \
  make \
  g++ \
  vips-dev \
  fftw-dev
COPY package.json yarn.lock ./
RUN yarn install \
  && yarn cache clean
COPY .env.production.local tsconfig.json tslint.json webpack.config.js ./
COPY src/ src/
RUN yarn build-prod \
  && cp build/resources/default-avatar-*.png ${PT_AVATARS_DIR_PATH}/
CMD yarn knex-migrate-latest-prod && yarn start-prod

FROM app as sync-friends-task
CMD ["yarn", "task-prod", "sync-friends"]

FROM app as evaluate-trackables-task
CMD ["yarn", "task-prod", "evaluate-trackables"]

FROM app as expire-trackables-task
CMD ["yarn", "task-prod", "expire-trackables"]

FROM app as reset-rewardable-review-count-task
CMD ["yarn", "task-prod", "reset-rewardable-review-count"]

FROM nginx:1.13.12-alpine as proxy
WORKDIR /etc/nginx
COPY nginx-config/ ./
CMD envsubst \$PT_CERTIFICATE_NAME,\$PT_LETSENCRYPT_CONFIG_DIR_PATH,\$PT_STATIC_SERVER_NAME,\$PT_AVATARS_DIR_NAME,\$PT_AVATARS_DIR_PATH,\$PT_ASSETS_DIR_NAME,\$PT_ASSETS_DIR_PATH < sites-available/static-ssl.conf > sites-enabled/static-ssl.conf \
  && envsubst \$PT_CERTIFICATE_NAME,\$PT_LETSENCRYPT_CONFIG_DIR_PATH,\$PT_APP_SERVER_NAME,\$PT_PORT < sites-available/proxy-ssl.conf > sites-enabled/proxy-ssl.conf \
  && nginx -g "daemon off;"
# CMD tail -f /dev/null
