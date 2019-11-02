# swpp2019-team4 [![Build Status](https://travis-ci.org/swsnu/swpp2019-team4.svg?branch=master)](https://travis-ci.org/swsnu/swpp2019-team4) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2019-team4&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2019-team4) [![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2019-team4/badge.svg)](https://coveralls.io/github/swsnu/swpp2019-team4)

## environments

* Yarn 1.17.3 or above
* Python 3.6.8
* pip3 9.0.1

## Frontend

### run
at root repositiory, type the following commands

* cd frontend
* yarn install
* yarn start

### test
at root repository, type the following commands

* cd frontend
* yarn install
* yarn test --coverage --watchAll=false

## Backend

### run
at root repository, type the following commands

* cd backend
* python3 manage.py migrate
* python3 manage.py runserver

### test
at root repository, type the following commands

* cd backend
* coverage run --source='./assaapp' manage.py test && coverage report (statement coverage)
* coverage run --branch --source='./assaapp' manage.py test && coverage report (branch coverage)
