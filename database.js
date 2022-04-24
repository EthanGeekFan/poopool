const mongoose = require("mongoose");
const { logger } = require("./utils");


async function initDatabase() {
    const dburi = "mongodb://localhost:12345/poopool";
    const db = mongoose.connection;

    // Add listeners
    db.on('open', () => { logger.info("Connected to MongoDB with URL: " + dburi); });
    db.on('error', (err) => { logger.error("Error connecting to MongoDB: " + err); });
    await mongoose.connect(dburi);
}

module.exports = { initDatabase };