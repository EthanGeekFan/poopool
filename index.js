const { WebSocket } = require('ws');
const { initDatabase } = require('./database');
const { initPool, saveBlock, getNextTask, minerJoin, minerLeave, getMiners } = require('./pool');
const { logger } = require('./utils');

async function main() {
    await initDatabase();
    await initPool();

    const wss = new WebSocket.Server({ port: 6666 });

    wss.on("connection", (ws, req) => {
        logger.info(`A miner joined from ${req.socket.remoteAddress}:${req.socket.remotePort}`);
        ws.on("message", async (message) => {
            message = message.toString();
            logger.verbose("Received: " + message);
            try {
                const data = JSON.parse(message);
                switch (data.type) {
                    case "submit":
                        await saveBlock(data.block);
                        try {
                            getMiners().forEach(miner => {
                                if (miner !== ws) {
                                    miner.send(JSON.stringify({
                                        type: "newBlock",
                                    }))
                                }
                            });
                        } catch (err) {
                            console.error(err);
                        }
                        break;
                    case "task":
                        ws.send(JSON.stringify({
                            type: "task",
                            task: await getNextTask(),
                        }));
                        break;
                    case "gpu_task":
                        ws.send(JSON.stringify({
                            type: "gpu_task",
                            task: await getNextGPUTask(),
                        }));
                    default:
                        throw new Error("Unknown message type");
                }
            } catch (err) {
                console.error(err);
                ws.send(JSON.stringify({
                    type: "error",
                    message: err.message,
                }));
            }
        });
        ws.on("error", (err) => {
            console.error(err);
            ws.close();
            minerLeave(ws);
        });
        ws.on("close", () => {
            logger.info(`Miner disconnected from ${req.socket.remoteAddress}:${req.socket.remotePort}`);
            minerLeave(ws);
        });
        minerJoin(ws);
    });

    console.log("Pool listening on port 6666");
}

main();
