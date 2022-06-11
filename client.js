// Include Nodejs' net module.
const Net = require('net');
const crypto = require('crypto');
const { logger } = require('./utils');
const canonicalize = require('canonicalize');


// function createClient(options, next = () => { }) {
//     const client = new Net.Socket();

//     client.on('data', (chunk) => {
//         const deliminatedChunk = chunk.toString().split(deliminater);
//         while (deliminatedChunk.length > 1) {
//             this.buffer += deliminatedChunk.shift();
//             try {
//                 const message = JSON.parse(this.buffer);
//                 switch (message.type) {
//                     case "chaintip":

//                 }
//             } catch (error) {
//                 logger.error("error: " + error);
//                 this.sendMessage(MESSAGES.ERROR(ERRORS.INVJSON));
//                 if (!this.handshake) {
//                     socket.end();
//                 }
//             } finally {
//                 this.buffer = "";
//             }
//         }
//         this.buffer += deliminatedChunk[0];
//         if (this.buffer.length > 0) {
//             this.timeout = setTimeout(() => {
//                 this.sendMessage(MESSAGES.ERROR(ERRORS.TIMEOUT));
//                 socket.end();
//             }, TIMEOUT_MS);
//         }
//     })

//     client.connect(options, function () {
//         logger.info(`TCP connection established with the server with options: ${JSON.stringify(options)}.`);
//         next(head);
//     });

//     return head;
// }

async function getChainTip() {
    return new Promise((resolve, reject) => {
        const client = new Net.Socket();
        client.on("data", (chunk) => {
            console.log(chunk.toString());
            chunk = chunk.toString().trim();
            try {
                message = JSON.parse(chunk);
                if (message.type === "chaintip") {
                    resolve(message.blockid);
                    client.end();
                }
            } catch (e) {
                console.log(e);
            }
        });

        client.connect({
            host: "149.28.220.241",
            port: 18018
        }, () => {
            logger.info("Connected to TA node.");
            client.write(JSON.stringify({
                "type": "hello",
                "version": "0.8.0",
                "agent": "PooPool"
            }));
            client.write(JSON.stringify(
                {
                    "type": "getchaintip"
                }
            ));
        });

        setTimeout(() => {
            reject("Timeout");
        }, 5000)
    });
}

function hash(payload) {
    return crypto.createHash('sha256').update(payload).digest('hex');
}

async function getObject(objectId) {
    return new Promise((resolve, reject) => {
        const client = new Net.Socket();
        client.on("data", (chunk) => {
            console.log(chunk.toString());
            chunk = chunk.toString().trim();
            try {
                message = JSON.parse(chunk);
                if (message.type === "object" && hash(canonicalize(message.object)) === objectId) {
                    resolve(JSON.parse(message.object))
                    client.end();
                }
            } catch (e) {
                console.log(e);
            }
        });

        client.connect({
            host: "149.28.220.241",
            port: 18018
        }, () => {
            logger.info("Connected to TA node.");
            client.write(JSON.stringify({
                "type": "hello",
                "version": "0.8.0",
                "agent": "PooPool"
            }));
            client.write(JSON.stringify({
                "type": "getobject",
                "objectid": objectId
            }));
        });

        setTimeout(() => {
            reject("Timeout");
        }, 5000)
    });
}

async function getMempool() {
    return new Promise((resolve, reject) => {
        const client = new Net.Socket();
        client.on("data", (chunk) => {
            console.log(chunk.toString());
            chunk = chunk.toString().trim();
            try {
                message = JSON.parse(chunk);
                if (message.type === "mempool") {
                    resolve(message.txids);
                    client.end();
                }
            } catch (e) {
                console.log(e);
            }
        });

        client.connect({
            host: "149.28.220.241",
            port: 18018
        }, () => {
            logger.info("Connected to TA node.");
            client.write(JSON.stringify({
                "type": "hello",
                "version": "0.8.0",
                "agent": "PooPool"
            }));
            client.write(JSON.stringify({
                "type": "getmempool"
            }));
        });

        setTimeout(() => {
            reject("Timeout");
        }, 5000)
    });
}

async function broadcast(object) {
    return new Promise((resolve, reject) => {
        const client = new Net.Socket();
        client.on("data", (chunk) => {
            console.log(chunk);
            chunk = chunk.toString().trim();
            try {
                message = JSON.parse(chunk);
                if (message.type === "error") {
                    console.log(message);
                }
            } catch (e) {
                console.log(e);
            }
        });

        client.connect({
            host: "149.28.220.241",
            port: 18018
        }, () => {
            logger.info("Connected to TA node.");
            client.write(JSON.stringify({
                "type": "hello",
                "version": "0.8.0",
                "agent": "PooPool"
            }));
            client.write(JSON.stringify({
                "type": "object",
                "object": canonicalize(object),
            }));
        });

        setTimeout(() => {
            console.log("broadcast timedout");
            reject("Timeout");
        }, 5000)
    });
}

module.exports = {
    getChainTip,
    getObject,
    getMempool,
    broadcast
}