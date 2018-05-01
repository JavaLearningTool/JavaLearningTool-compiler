# build from openjdk
FROM openjdk:10

# build from latest version of node
FROM node:latest

# Declare that we expect CHALLENGE_REPO as an ARG
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

# Clone challenges
RUN git clone ${CHALLENGE_REPO}
RUN mv JavaLearningTool-challenges challenges

# Add challenge repo to environment
ENV CHALLENGE_REPO=${CHALLENGE_REPO}

# add the rest of my code
COPY . /usr/src/app

EXPOSE 3000
CMD ["npm", "start"]