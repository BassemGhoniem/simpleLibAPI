FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/simpleLibAPI
WORKDIR /usr/src/simpleLibAPI

# Install app dependencies
COPY package.json /usr/src/simpleLibAPI/
RUN npm install

# Bundle app source
COPY . /usr/src/simpleLibAPI

EXPOSE 8080
CMD [ "npm", "start" ]