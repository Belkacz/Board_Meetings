#!/bin/sh

# Naturally, the certificates and password would be outside the project, they are only included here as part of the example

SSL_KEYFILE="./certs/key.key"
SSL_CERTFILE="./certs/cert.crt"
SSL_PASSWORD="test1"

if [ ! -d ./fastApi_backend/fastapienv ]; then
    python -m venv ./fastApi_backend/fastapienv
    . ./fastApi_backend/fastapienv/bin/activate
    pip install -r ./fastApi_backend/requirements.txt
else 
    . ./fastApi_backend/fastapienv/bin/activate
fi

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

