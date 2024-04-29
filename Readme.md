# Woo Product Editor workshop

Repository for the [Ready to try the new product editor?](https://europe.wordcamp.org/2024/session/ready-to-try-the-new-product-editor/) workshop of the WordCamp Europe 2024 edition.


## Basic Requirements

### WordPress Development Environment

we use [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/) core tool to set up the development environment.

### Clone this repository

### PHP, JavaScript (React) basic Knowledge

### IDE/Code Editor

### Node or NVM (Node Version Manager) installed

## Starting up the dev-env

```cli
cd woo-product-editor-workshop
```

```cli
WP_ENV_PORT=88 wp-env start
```

user: `admin`
password: `password`


## Start the REST API server

Install [json-server](https://github.com/typicode/json-server) app:

```cli
npm install json-server
```

Start up the server
```cli
npx json-server fixture/db.json --port 3000 --host localhost
```
