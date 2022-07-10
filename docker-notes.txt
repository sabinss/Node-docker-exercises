FROM node:15
WORKDIR /app
RUN npm install -g nodemon
COPY package.json .
RUN npm install
COPY . .
ENV PORT 3000
EXPOSE $PORT
CMD ["npm","run","dev"]


# why we need to set WORKDIR = /app
#   - once we set workdir, whenever we run any command it runs from /app directory
#   - In line number 5 ->COPY . . command will be relative to /app directory

## why we copy package.json file first and then rest of the source code
# - In docker every step is layer and all the layer forms docker image.
# - afeter running every layer docker cache the result
# -if we copy all the file instead of package.json first-> next time when we build container and there is change is source code
# -  npm install will always run event there is no chnage in package.json file


# Docker command:
# 1. docker build .
# 2. docker image rm <docker-id> -> delete docker image
# 3. docker build -t <docker-image-name> .
# 4 run docker container: docker run -d --name <docker-container-name> <docker-image-name> 
#     - here -d is used for running docker in detached mode-> meaning it frees the cli 
#     -<docker-container-name> -> give any name that you want for your docker container
# to list all the  running docker-> docker ls
# deleting running container -> docker rm <docker-container-name> -f 
# docker run -d -p 3000:3000 --name <docker-container-name> <docker-image-name> 
#    - outside world cannot communicate directly to the docker container
#    -p 3000:3000 applyint this in docker run command any traffic from outside world to 3000 will be redirected to the docker container

# how to check file system inside docker container
#  - docker exect -it <docker-name> bash
# - exit: command can be used to exit from container cli

# show all docker container: docker ps
# show all docker running and stopped container: docker ps -a
# to debug docker if it exited then: docker logs <docker-id> or <docker-name>

## volumens in docker
# - there are different types of volumes in docker.
# - volume is use to sycn the files and folder of your local machine to the the directory of the container
# - so this saves from building image and running container every time when we make changes in our code.
# - cmd: docker run -v <path-to-folder-on-your-location>:<path-to-folder-on-container> -p 3000:3000 -d --name <docker-name> <image-name>
#  e.g docker run -v $(pwd):/app -p 3000:3000 -d --name node-app node-app-image
#  ## to get current working directory in different shell and os
#  in cmd: %cd%
#  in powershell ${pwd}
#  in mac: $(pwd)


## Issue with bind mount volume:
# - when we bind mount docker container references files and folder from your directory
# - if we delete node_modules from our directory, docker container tries to access node_modules from local directory instead of its ows directory
# - due to which server crashes
# -Solution: we can force docker container to rely on its own directory for node_modules insted of reaching to local directory
# - we can do by creating another volume.
# e.g docker run -v $(pwd):/app -v /app/node_modules -p 3000:3000 -d --name node-app node-image-app


## volume bind mount syncs and shares file in both direction
# - meaning: if we create files in our local computer, it creates in docker container and vice versa
# - but for best practices we dont want to change files from the docker cotainer. for that we can create readonly bind mount->it restricts to create, edit and delete files in docker container.
# - e.g docker run -v $(pwd):/app:ro -v /app/node_modules -p 3000:3000 -d --name node-app node-image-app
# -   i.e ro= for read only

## Notes:
# - every time when we create and delete docker container with -v tag it creates volume.
# - to check list of volumes created-> docker volume ls
# - to remove all volumens-> docker volume prune
# - to delete volumen associated with that container -> docker container rm <docker-id> -fv


## ENV file in docker
# - passing env varaible on docker run command
#  -e.g docker run -v $(pwd):/app:ro -v --env PORT=4000 /app/node_modules -p 3000:4000 -d --name node-app node-image-app

#  - to see env files in linux machine inside docker.
#    - run docker command in -exec mode: and type printenv

## creating env file and passing env file while running docker:
# -e.g docker run -v $(pwd):/app:ro -v --env-file ./.env PORT=4000 /app/node_modules -p 3000:4000 -d --name node-app node-image-app

#  ./.env = from current directory to location of env file.