FROM node:18.13.0

ARG project_path
COPY ./$project_path/package*.json /home/node/karAssistant-discordClient/
WORKDIR /home/node/karAssistant-discordClient/
RUN npm install --omit=dev
RUN npm install @tensorflow/tfjs-node
COPY ./$project_path .
CMD ["npm", "run", "startSever"]