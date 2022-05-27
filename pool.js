const ed = require('@noble/ed25519');
const crypto = require('crypto');
const { MinedBlock } = require('./models');
const canonicalize = require('canonicalize');
const { logger } = require('./utils');

const target = "00000002af000000000000000000000000000000000000000000000000000000";
const nonceChunkSize = 0x1000000000000000000000000000000000000000000000000000000000000;

const miners = [];

let currentState = {
    publicKey: null,
    privateKey: null,
    height: 1, // default to 1
    prev_id: "00000000a420b7cefa2b7730243316921ed59ffe836e111ca3801f82a4f5360e", // default to genesis block
    block: null,
    coinbase: null,
    coinbaseHash: null,
    nonce: 0,
    updating: null,
};

async function getNextTask() {
    if (currentState.updating !== null) {
        await currentState.updating;
    }
    const block_split = canonicalize(currentState.block).split('null');
    const task = {
        nonce_start: currentState.nonce,
        nonce_end: currentState.nonce + nonceChunkSize,
        block_prefix: block_split[0],
        block_suffix: block_split[1],
        target: target,
    }
    currentState.nonce += nonceChunkSize;
    return task;
}

function poolState() {
    return currentState;
}

function getMiners() {
    return miners;
}

function hash(payload) {
    return crypto.createHash('sha256').update(payload).digest('hex');
}

async function initPool() {
    const tip = await MinedBlock.findOne({}).sort({ height: -1 }).exec();
    if (tip) {
        currentState.height = tip.height + 1;
        currentState.prev_id = tip.blockid;
    }
    // start mining
    await nextBlock();
}

async function nextBlock() {
    // Generate a new keypair
    let privateKey = ed.utils.randomPrivateKey();
    let publicKey = await ed.getPublicKey(privateKey);
    currentState.publicKey = Buffer.from(publicKey).toString('hex');
    currentState.privateKey = Buffer.from(privateKey).toString('hex');
    // Generate a new coinbase transaction
    const coinbase = {
        height: currentState.height,
        outputs: [
            {
                pubkey: currentState.publicKey,
                value: 5e13,
            }
        ],
        type: "transaction",
    }
    const coinbaseHash = hash(canonicalize(coinbase));
    currentState.coinbase = coinbase;
    currentState.coinbaseHash = coinbaseHash;
    // Generate a new block
    const newBlock = {
        type: "block",
        txids: [coinbaseHash],
        previd: currentState.prev_id,
        created: (Date.now() / 1000) | 0,
        T: target,
        miner: "Blockheads PooPool",
        note: "This is for sale. Please contact us if you want to buy it.",
        nonce: "null",
    }
    currentState.block = newBlock;
    logger.info("Generated new block: " + JSON.stringify(currentState));
}

function varifyBlock(block) {
    // Verify the pow
    const blockHash = hash(block);
    if (blockHash >= target) {
        throw new Error("Invalid proof of work");
    }
    // Verify the block is valid
    const blockObj = JSON.parse(block);
    const dummyBlock = {
        ...currentState.block,
    }
    dummyBlock.nonce = blockObj.nonce;
    const dummyBlockHash = hash(canonicalize(dummyBlock));
    if (dummyBlockHash !== blockHash) {
        throw new Error("Block is not valid. You may be using an outdated version of the block.");
    }
}

async function saveBlock(block) {
    currentState.updating = new Promise((resolve, reject) => {
        varifyBlock(block);
        const blockHash = hash(block);
        const minedBlock = new MinedBlock({
            block: block,
            privateKey: currentState.privateKey,
            publicKey: currentState.publicKey,
            transaction: canonicalize(currentState.coinbase),
            height: currentState.height,
            blockid: blockHash,
        });
        minedBlock.save();
        currentState.height += 1;
        currentState.prev_id = blockHash;
        currentState.block = null;
        currentState.coinbase = null;
        currentState.coinbaseHash = null;
        currentState.nonce = 0;
        nextBlock().finally(() => {
            resolve();
        });
    })
    await currentState.updating;
}

function minerJoin(miner) {
    miners.push(miner);
}

function minerLeave(miner) {
    const index = miners.indexOf(miner);
    if (index > -1) {
        miners.splice(index, 1);
    }
}


module.exports = {
    initPool,
    saveBlock,
    poolState,
    getNextTask,
    minerJoin,
    minerLeave,
    getMiners,
};
