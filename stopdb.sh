#!/bin/bash
# Check docker installation and start a mongodb container
author="Yifan Yang"
version=1.0

echo "Blockhead Docker Configuration Script - Stop MongoDB"
echo "Author: $author"
echo "Version: $version"


function stop_db
{
    # Check if the blockhead container is running
    docker container inspect blockhead > /dev/null 2>&1
    if [ $? -ne 0 ]
    then
        echo "${GREEN}blockhead container is not running!${NC}"
        db_res=0
        return
    fi

    echo "${YELLOW}Stopping blockhead container...${NC}"
    (docker stop blockhead || docker rm blockhead) > /dev/null 2>&1

    # Check if the blockhead container is still running
    docker container inspect blockhead > /dev/null 2>&1
    if [ $? -eq 0 ]
    then
        echo "$ERROR Failed to stop blockhead container!"
        db_res=1
        return
    fi

    echo "${GREEN}blockhead container is stopped!${NC}"
    db_res=0
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

stop_db

exit $db_res