# JVC Poképost

# Développement

## Server

#### Dependencies
- php v5.4+

__dev__
- composer v1+

#### Installation
Clone the repo, and execute `make install` in the `server` directory.

#### Tests
Run `make test` in the `server` directory.

#### Linting
Run `make lint` in the `server` directory.

## Client

#### Dependencies
- node v4+

__Dev__
- npm v3+
- gulp v3+

#### Installation
Clone the repo, move in the `client` driectory and execute `npm install`.

#### Build
- __Simple build__ : run `gulp build`.
- __Build on changes__ : run `gulp watch`.
- __Live dev on Chrome__ : run `gulp dev-on-chrome` or `gulp watch-on-chrome`.

#### Tests
Run `gulp test`.

#### Linting
Run `gulp lint`.

## Configuration
The script configuration is in `client/src/config/pokemon-data.js`.
