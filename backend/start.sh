#!/bin/sh

# Naturally, the certificates and password would be outside the project, they are only included here as part of the example

SSL_KEYFILE="./certs/key.key"
SSL_CERTFILE="./certs/cert.crt"
SSL_PASSWORD="test1"

if [ ! -f "$SSL_KEYFILE" ] || [ ! -f "$SSL_CERTFILE" ]; then
    echo "Uruchamianie w tybie HTTP"
    uvicorn fastApi_backend.main:app
    exit 1
else
    echo "Uruchamianie w trybie HTTPS"
    uvicorn fastApi_backend.main:app --ssl-keyfile "$SSL_KEYFILE" --ssl-certfile "$SSL_CERTFILE" --ssl-keyfile-password="$SSL_PASSWORD" || {
        echo -e "\n Niepoprawne hasło, wprowadź hasło ręcznie"
        uvicorn fastApi_backend.main:app --ssl-keyfile "$SSL_KEYFILE" --ssl-certfile "$SSL_CERTFILE"
    }
fi


# SSL_KEYFILE="./certs/key.key"
# SSL_CERTFILE="./certs/cert.crt"

# if [ ! -f "$SSL_KEYFILE" ] || [ ! -f "$SSL_CERTFILE" ]; then
#     echo "uruchamianie w tybie http"
#     uvicorn main:app
#     exit 1
# fi

# uvicorn main:app --ssl-keyfile "$SSL_KEYFILE" --ssl-certfile "$SSL_CERTFILE" --ssl-keyfile-password="test1"
