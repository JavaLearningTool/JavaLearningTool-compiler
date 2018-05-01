# build from openjdk
FROM openjdk:9

# build from latest version of node
FROM node:latest

ARG CHALLENGE_REPO

# setup java home
ENV JAVA_HOME=/usr/lib/java/bin
# add java to path
ENV PATH="/usr/lib/java/bin:${PATH}"
# copy java from openjdk
COPY --from=0 /docker-java-home /usr/lib/java
# policy file
COPY ./java.policy /usr/lib/java/lib/security/default.policy

# make a directory where the app will live
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add the package and install dependencies
COPY package.json /usr/src/app/
RUN npm install

# add the rest of my code
COPY . /usr/src/app

RUN git clone ${CHALLENGE_REPO}

EXPOSE 3000
CMD ["npm", "start"]