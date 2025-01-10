| Informacje  | Dane |
| ------------- |:-------------:|
| autor      | Łukasz Belka     |
| index     | 156162    |
| Grupa      | D1     |
| Rok akademicki      | 2024/2025     |

# Pobieranie:
W przypadku posiadania już plików przejdź do punktu #Rozruch
Pobieramy projekt używając:
```
git clone https://github.com/Belkacz/Board_Meetings.git
```
lub 
```
git clone git@github.com:Belkacz/Board_Meetings.git
```
ewentualnie pobieramy zipa z https://github.com/Belkacz/Board_Meetings

# Uruchamianie:
### Baza danych mysql
Aby uruchomić lokalnie aktualną wersję board meeting potrzebny jest system baz danych mySQL.
`sudo apt install mysql-server`
Logujemy się do mySql podajemy jako import dane z pliku `db_meetings.sql` lub wklejamy go jako komendy SQL. 

### Backend
Musimy zainstalować python (najlepiej 3.10+), oraz pip.
komendy linux:
```
sudo apt update
sudo apt upgrade
sudo apt install python3
```
instalcję możemy zweryfikować komendą : `python3 --version`
```
sudo apt install python3-pip
```
analogicznie `pip –version`.

Tworzymy środowisko, aktywujemy i instalujemy wymagane paczki. Robimy to z głównego folderu projektu BoardMeetings przechodząc do backend jak poniżej.
```
cd backend
./start-dev.sh
```
Skrypt `start-dev.sh` powinien sprawdzić czy posiadamy ptyhon czy pip następnie utworzyć i zainstalować wymagane paczki oraz aktywować środowisko i włączyć aplikację.
W przypadku problemów należy utworzyć środowisko ręcznie i zainslować dane z requrements.txt.
```
cd backend
python3 -m venv fast-env
source fast-env/bin/activate
pip install -r requirements.txt
```

### windows backend
Dla widnows trzeba zainstalować ręcznie python pobierając go z strony `https://www.python.org/downloads/` i dodać do zmiennych środowiskowych główne różnice które będziemy mieli to tworzenie środowiska komendą `py -m venv .fast-env`, zaś  aktywacja środowiska zamiast `fast-env/bin/activate` będzie `fast-env\Scripts\Activate`.

komenda `.sh` może nie działać na windows w takim przypadku należy przejść do folderu niżej tj. `fastApi_backend` i manulanie wywołać go komendą `uvicorn main:app`

### front-end
W przypadku frontu sprawa jest prostsza musimy zainstalować node v20.9.0 (lts) lub wyższą. Polecam też zainstalować nvm instrukcja https://github.com/nvm-sh/nvm. Następnie instalujemy node.
```
nvm install 20.9.0
nvm use 20.9.0
```
Opcjonalnie możemy doinstalować Yarn. 
```
npm install --global yarn
```
angualr instalujemy w zależności od używanego meadżera:
`npm install -g @angular/cli` lub  `yarn install -g @angular/cli`

Przechodzimy z Głównego foleru BoardMeetings do folderu frontend i instalujemy paczki wybranym menadżera jeśli mamy Yarn zamieniamy npm na yarn.
```
cd frontend
npm install
```
Teraz uruchamiamy skrypt startujący:
```
./start-dev.sh
```
działa on niezależnie od używanego menadżera paczek yarn lub npm.

Wchodzimy na stronę `http://localhost:4200/`

Uwaga: skrypty `start.sh` korzystają z opcji httpS przeznaczonej dla już wystawionej aplikacji : https://boardmeetings.vino.paga.gg/ te komendy mogą nie działać lokalnie dlatego polecam korzystać z `./start-dev.sh` .

### widnows front-end
Dla widnows musimy pobrać odpowiedni node.js z strony `https://nodejs.org/en/download`
po jego pobraniu i dodaniu do zmiennych środowiskowych całą resztę możemy już wykonywać jak w przypadku linuxa.
Jeśli skrypt `.sh` nie zadziała należy odpalić fornt ręcznie używając w folderze `Board_Meetings/frontend` komendy `yarn start-proxy` lub `npm start-proxy`.


# BoardMeetings

Preview to wystawiona na klaster kubenetes aplikacja (aktualnie jeszcze wersja bez bazy).

## [Preview](https://boardmeetings.vino.paga.gg/)

Click [here](https://boardmeetings.vino.paga.gg/) or on sub-title to see my project.

**This preview of app is full funcionally production build and set on kubernettes kluster with docker image. Front-end and backend are set on two separeted pods**

## Front-end

## How to start

The front-end is built using the Angular framework.

First, ensure you have Node.js and npm or yarn installed on your machine. It's recommended to use the LTS version. Next, install all dependencies by running `npm install` or `yarn install`. If you encounter any issues, try installing Angular globally with `npm install -g @angular/cli`.

Now you can start the project with "`./start-dev.sh`"

Navigate to `http://localhost:4200/`. The application will automatically reload if you make any changes to the source files.


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Backend:

First You need to isntall python3.10+ create env using comands and isntall requeiermnts"
```
python3 -m venv fast-env
source fast-env/bin/activate
pip install -r requirements.txt
```

The backend is built on FastAPI. You can build it manually or use my bash script:

Navigate to the backend directory and run the "`./start-dev.sh`".

For manual run go to `Board_Meetings/backend/fastApi_backend` and use `uvicorn main:app`

The app should be available at `http://localhost:8000`. Swagger UI is available at `http://localhost:8000/docs`.

## Docker

The project has Dockerfiles configured, one for the backend and one for the front-end. The easiest way to run the app using Docker is to use the command docker-compose up in the main folder. This command triggers the docker-compose.yml file, which runs both Dockerfiles.