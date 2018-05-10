#!/bin/sh

action="certonly"

if [ -e "${PT_LETSENCRYPT_CONFIG_DIR_PATH}/live/${PT_CERTIFICATE_NAME}/fullchain.pem" ]
then
  action=renew
else
  cat > "${PT_LETSENCRYPT_CONFIG_DIR_PATH}/renewal-hooks/deploy/nginx" <<- EOF
  #!/bin/sh
  docker exec progress_tracker_back_proxy_1 nginx -s reload
EOF
  chmod +x "${PT_LETSENCRYPT_CONFIG_DIR_PATH}/renewal-hooks/deploy/nginx"
fi

docker run \
  --rm \
  -p 80:80 \
  -v "${PT_LETSENCRYPT_CONFIG_DIR_PATH}:/etc/letsencrypt" \
  -v "${PT_LETSENCRYPT_WORK_DIR_PATH}:/var/lib/letsencrypt" \
  certbot/certbot:v0.23.0 \
  "${action}" \
  --standalone \
  --preferred-challenges http \
  -n \
  --no-self-upgrade \
  --agree-tos \
  -m "${PT_ADMIN_EMAIL}" \
  -d "${PT_STATIC_SERVER_NAME}" \
  -d "${PT_APP_SERVER_NAME}" \
  -d "${PT_LANDING_SERVER_NAME}" \
  --cert-name "${PT_CERTIFICATE_NAME}"
