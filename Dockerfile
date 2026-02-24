FROM node:20-alpine

WORKDIR /app

RUN npm init -y
RUN npm install ws bcryptjs

COPY server.js .
COPY index.html .

RUN mkdir /data

EXPOSE 3000

CMD ["node","server.js"]
