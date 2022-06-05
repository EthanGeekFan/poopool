const mongoose = require("mongoose");

const minedBlockSchema = new mongoose.Schema({
    block: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    transaction: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    blockid: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, { versionKey: false });

const MinedBlock = mongoose.model("MinedBlock", minedBlockSchema);

const contributorSchema = new mongoose.Schema({
    credit: {
        type: Number,
        default: 0,
    },
    SUNetID: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, { versionKey: false });

const Contributor = mongoose.model("Contributor", contributorSchema);

module.exports = {
    MinedBlock,
    Contributor,
};
