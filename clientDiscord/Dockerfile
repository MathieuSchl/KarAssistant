FROM node:18.13.0

ARG project_path
COPY ./$project_path/package*.json /home/node/$project_path/
WORKDIR /home/node/$project_path/
RUN npm install --omit=dev
RUN npm install @tensorflow/tfjs-node
COPY ./$project_path .
CMD ["npm", "run", "startSever"]