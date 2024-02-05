#!/bin/bash

# This script is used to test the functionality of the program.
# It starts a new database in docker, runs the server, then runs the e2e tests
print_red () {
  printf "\033[1;31m$1\033[0m\n"
}

print_blue () {
  printf "\033[1;34m$1\033[0m\n"

}

start() {
  # print_blue "Starting docker images..."
  # docker run --rm --name ibs3-playwright-mariadb -e MYSQL_ROOT_PASSWORD=ibs3 -e MYSQL_DATABASE=ibs3 -d -p 44441:3306 mariadb:latest || exit
  # docker run --rm --name ibs3-playwright-redis -d -p 6379:6379 redis:latest

  print_blue "Starting server..."
  npm run dev:backend &> ./tests/logs/backend.log &
  SERVER_PID=$!
  print_red "Server PID: $SERVER_PID"
  print_blue "Starting frontend..."
  npm run dev:frontend &> ./tests/logs/frontend.log &
  FRONTEND_PID=$!
  print_red "Frontend PID: $FRONTEND_PID"
}

run() {
  npm run test:playwright

  if [[ $REPORT == true ]]; then
    npm run test:report
  fi

  print_red "Test finished, killing all processes..."

  killall
}

stop_container_if_exists () {
  if [[ $(docker ps -a | grep $1) != "" ]]; then
    print_red "Stopping $1..."
    docker stop $1
  fi
}

killall() {
  print_red "Stopping"

  # if the server is still running, kill it
  if [[ $SERVER_PID != "" ]]; then
    print_red "Killing server..."
    kill $SERVER_PID
  fi

  # if the frontend is still running, kill it
  if [[ $FRONTEND_PID != "" ]]; then
    print_red "Killing frontend..."
    kill $FRONTEND_PID
  fi

  print_red "Killing docker images..."
  stop_container_if_exists ibs3-playwright-mariadb
  stop_container_if_exists ibs3-playwright-redis
}



print_blue "Starting e2e tests with playwright!"

# check if the user passed the -report flag
if [[ $1 == "-report" ]]; then
  print_blue "Generating report afterwards..."
  REPORT=true
fi

# Trap the exit signal, and kill all processes
trap "killall" EXIT
start
# run