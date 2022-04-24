const { transports, format, createLogger } = require("winston");

const logger = createLogger({
    level: "silly",
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.json(),
    ),
    transports: [
        new transports.File({ filename: "logs/errors.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),
        new transports.Console(),
    ],
});

module.exports = { logger };