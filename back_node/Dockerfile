FROM node:18.13.0

COPY ./package*.json /home/node/Karassistant/
WORKDIR /home/node/Karassistant/
RUN npm install --omit=dev
COPY . .
CMD ["npm", "run", "start"]