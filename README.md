SKIP: INSTALLATION Strapi\
$ npx create-strapi-app my-project --quickstart

START PROJECT\
$ npm run develop

DEFAULT: user/pass = admin/password

GENERATE CERT & KEY\
$ openssl genrsa 2048 > ca-key.pem\
$ openssl req -new -x509 -nodes -days 3600 \\\
         -key ca-key.pem -out ca.pem