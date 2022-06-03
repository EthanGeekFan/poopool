# Blockheads PooPool

First Marabu Mining Pool.

## Project setup

This is a simple node.js server using JavaScript. It uses WebSockets to communicate with the clients. The main server logic currently resides in the `index.js` file.

All pool logic is implemented in the `pool.js` file.

`database.js` is a simple database connection helper. You can edit the connection URL if you decided to use a different port.

`models.js` contains the models for the database.

`name_generator.js` contains a simple name generator that uses `Namy`'s free API to generate random names.

**Note**: This pool does not do any mining. It generates blocks and assign tasks to connected clients.

## Project focus

Maybe we should make this pool a loadable module for a full Marabu node. Or we could add Marabu node capabilities to this Pool. Previously, I was running this server side by side with our full node on Vultr.

### Get it up and running

First clone this project to your local machine. Then run `npm install` in the root directory to install all the dependencies.

This project requires a running MongoDB instance accessible via `localhost:12345`. At my time of development. I used docker to make this easy. Docker is recommanded for its ease of use with the startup script I provided and it will not mess up your local environment. You can also use a local MongoDB instance.

#### Install `docker` on macOS

Installation on macOS is extremely simple with `brew`:

```shell
brew install --cask docker
```

[Installation on other platforms](https://docs.docker.com/get-started/) are also quite straightforward.

#### Start the MongoDB instance before you start the server

Simply use the shell script I wrote with `npm run`: (from project root)

```shell
npm run db
```

Check the output of the script to see if it started successfully.

Stopping and cleaning of the MongoDB container is also easy:

```shell
npm run stopdb
```

#### Start the server

Run the server:

```shell
npm start
```

For development convenience, you can also run the server with automated restart:

```shell
node run dev
```

This will use nodemon to automatically restart the server when source code changes.

## Contributing

Feel free to discuss any ideas by [opening an issue](https://github.com/EthanGeekFan/poopool/issues/new) or by [opening a pull request](https://github.com/EthanGeekFan/poopool/pulls). Or you can @ me on Piazza.

You don't need to write code to discuss! Any feedback is welcome! e.g. pool logic and protocol designs.
