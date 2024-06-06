#!/bin/sh

# Naturally, the certificates and password would be outside the project, they are only included here as part of the example
#u need to instal python3 (sudo apt-get install python3), python pip (sudo apt install python3-pip) and python env (apt install python3.10-venv)
SSL_KEYFILE="./certs/key.key"
SSL_CERTFILE="./certs/cert.crt"
SSL_PASSWORD="test1"

if ! command -v python3; then
    echo "Python3 is not installed. Please install Python3 and try again."
    exit 1
fi

if ! command -v pip ; then
    echo "Pip is not installed. Please install python3 pip and try again."
    exit 1
fi

if ! command -v python3 -m venv ; then
    echo "Venv is not installed. Please install python3 venv and try again."
    exit 1
fi

if [ ! -d ./fastApi_backend/fastapienv ]; then
    python3 -m venv ./fastApi_backend/fastapienv
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

