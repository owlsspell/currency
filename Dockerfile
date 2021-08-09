FROM node:16-alpine3.11
WORKDIR /code
COPY package*.json ./
# RUN apt-get install bash
# RUN CI=true
# RUN ls -al,
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","start"]