FROM node:18.13.0

RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

ARG project_path
COPY ./$project_path/package*.json /home/node/Karassistant/
WORKDIR /home/node/Karassistant/
RUN npm install --force --omit=dev
RUN npm install --force @tensorflow/tfjs-node
COPY ./$project_path .
CMD ["npm", "run", "startSever"]