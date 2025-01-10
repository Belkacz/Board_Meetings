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


if [ ! -d ./fast-env ]; then
    python3 -m venv ./fast-env
    . ./fast-env/bin/activate
    pip install -r ./requirements.txt
else 
    . ./fast-env/bin/activate
    # Porównanie pip freeze z requirements.txt
    pip freeze > ./current_packages.txt
    if ! diff -q ./current_packages.txt ./requirements.txt > /dev/null 2>&1; then
        echo "Znaleziono różnice w pakietach. Aktualizacja środowiska..."
        pip install -r ./requirements.txt
    else
        echo "Pakiety są zgodne z requirements.txt."
    fi
    rm ./current_packages.txt
fi

cd ./fastApi_backend

echo "Uruchamianie w tybie HTTP"
uvicorn main:app
exit 1
fi

