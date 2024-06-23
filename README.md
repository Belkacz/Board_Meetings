# BoardMeetings

## Preview (deprecated)

Click here to see [Preview](https://board-meetings.vercel.app/) of project.

Since I started to build the backend part of the app on Vercel, the platform used for deploying JS sites without backend, cannot handle these changes. You can check it there, but it reflects the state from the beginning of 2024 (January).

## Front-end

## How to start

The front-end is built using the Angular framework.

First, ensure you have Node.js and npm or yarn installed on your machine. It's recommended to use the LTS version. Next, install all dependencies by running `npm install` or `yarn install`. If you encounter any issues, try installing Angular globally with `npm install -g @angular/cli`.

Now you can start the project with `npm start` or `yarn start`.

Alternatively, you can use the native Angular command `ng serve` for a development server.

Navigate to `http://localhost:4200/`. The application will automatically reload if you make any changes to the source files.


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Backend:

The backend is built on FastAPI. You can build it manually or use my bash script:

Navigate to the backend directory and run the ./start.sh script. This script creates a Python 3 environment, installs all dependencies, and runs the project. You need to have Python 3, pip, and venv installed.

Alternatively, you can run it manually by creating a Python 3 environment yourself, installing dependencies from requirements.txt, and finally running `uvicorn main:app`.

The app should be available at `http://localhost:8000`. Swagger UI is available at `http://localhost:8000/docs`.

## Docker

The project has Dockerfiles configured, one for the backend and one for the front-end. The easiest way to run the app using Docker is to use the command docker-compose up in the main folder. This command triggers the docker-compose.yml file, which runs both Dockerfiles.
