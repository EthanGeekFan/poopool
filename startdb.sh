#!/bin/bash
# Check docker installation and start a mongodb container
author="Yifan Yang"
version=1.0

echo "Blockhead Docker Configuration Script - Start MongoDB"
echo "Author: $author"
echo "Version: $version"


function start_db
{
    # Check if the blockhead container is already running
    docker container inspect blockhead > /dev/null 2>&1
    if [ $? -eq 0 ]
    then
        echo "${GREEN}blockhead container is already running!${NC}"
        db_res=0
        return
    fi

    echo "${YELLOW}Starting blockhead container...${NC}"

    echo "Checking mongo docker image status..."

    docker image inspect mongo:latest --format="Created: {{.Created}}"

    if [ $? -eq 0 ]
    then
        echo "${GREEN}Mongo docker image is already installed, checking updates...${NC}"
    else
        echo "${YELLOW}Mongo docker image is not installed, pulling...${NC}"
    fi

    docker pull mongo:latest

    project_dir=$(pwd)
    echo Project_dir: $project_dir

    db_dir=$project_dir/db

    echo "Mounting $db_dir to /data/db in container as a volume..."
    echo "> docker run --rm --name blockhead -d -p 12345:27017 -v $db_dir:/data/db mongo"
    docker run --rm --name blockhead -d -p 12345:27017 -v $db_dir:/data/db mongo

    echo

    docker container inspect blockhead > /dev/null 2>&1
    if [ $? -eq 0 ]
    then
        echo "${GREEN}Successfully started blockhead!${NC}"
        db_res=0
        return
    else
        echo "${RED}Failed to start blockhead!${NC}"
        db_res=1
        return
    fi
}

echo "----------------------------------------------------"

# Constants
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color
ERROR="${RED}Error:${NC}"

DOCKER_NOT_INSTALLED="Docker not installed correctly"

echo "Checking docker installation..."

which docker

if [ $? -eq 0 ]
then
    docker --version | grep "Docker version"
    if [ $? -eq 0 ]
    then
        echo "Docker Installation Correct: $(docker --version)"
    else
        echo $ERROR $DOCKER_NOT_INSTALLED
    fi
else
    echo $ERROR $DOCKER_NOT_INSTALLED
    exit 1
fi

echo "----------------------------------------------------"
start_db

exit $db_res