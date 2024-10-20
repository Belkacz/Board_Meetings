FROM node:18 AS build
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN npm run build --prod

FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/board-meetings /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
