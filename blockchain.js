import sha256 from 'crypto-js/sha256.js';

/**
 * @class
 * @param {number} index - Index of the Block.
 * @param {object} data - Data of the Block.
 * @param {number} timestamp - Unix timestamp of the Block.
 * @param {string} prevHash - The previous hash.
 */
class Block {
    constructor(index, data, timestamp, prevHash) {
        this.index = index;
        this.data = data;
        this.timestamp = timestamp;
        this.prevHash = prevHash;

        if (index == 0) this.prevHash = '0';

        this.hash = this.compute_hash();
    }

    /**
     * @returns {string} Hash of the block.
     */
    compute_hash() {
        return sha256(`${this.index}x${JSON.stringify(this.data)}x${this.timestamp}x${this.prevHash}`).toString();
    }
}

/**
 * Creates a new Blockchain
 * @class
 * @param {boolean} debugMode - Enable console debugging when a block is created and when the chain is validated.
 */
class Blockchain {
    constructor(debugMode = false) {
        this.blockchain = [];
        this.blockchainReference = {};
        this.currentIndex = 0;
        this.debugMode = debugMode;
    }
    /**
     * Creates and inserts a Block to the Blockchain.
     * @param {string} data - Data of the Block.
     * @param {string} name - Name of reference.
     * @returns {true} 
     */
    insert_block(data, name) {
        const createdBlock = new Block(this.currentIndex,
            JSON.stringify(data),
            Date.now(),
            (this.blockchain.length > 0) ? this.blockchain[this.currentIndex - 1].hash : '0',    
        );
        this.blockchainReference[name] = this.currentIndex;
        this.blockchain.push(createdBlock);
        if (this.debugMode) {
            console.log(`[${this.currentIndex}] - ${this.blockchain[this.currentIndex].hash} <-- Generated Hash.`);
        }
        this.currentIndex++;
        return true;
    }
    /**
     * Inserts a Block to the Blockchain.
     * @param {Block} block - Block.
     * @param {String} name - Name of reference.
     * @returns {true} 
     */
    insert(block, name) {
        this.blockchainReference[name] = this.currentIndex;
        this.blockchain.push(block);
        if (this.debugMode) {
            console.log(`[${this.currentIndex}] - ${this.blockchain[this.currentIndex].hash} <-- Generated Hash.`);
        }
        this.currentIndex++;
        return true;
    }
    /**
     * Searches for a Block based on its name when it was created.
     * @param {string} name 
     * @returns {Block}
     */
    search(name) {
        return this.blockchain[this.blockchainReference[name]];
    }

    /**
     * Extracts a data point based on the Blocks name.
     * @param {string} name 
     * @param {string} point 
     * @returns {(string|number|Object)}
     */
    extract(name, point) {
        if (!this.search(name).hasOwnProperty(point)) return;
        if (point.toLowerCase() == 'data') return JSON.parse(this.search(name)[point]);
        return this.search(name)[point]
    }

    /**
     * Verifies all the Blocks in the Blockchain. 
     * @returns {(true|false)}
     */
    verify() {
        for (let i = 1; i < this.blockchain.length; i++) {
            if (this.debugMode) {
                console.log(`[${i}] - ${this.blockchain[i].prevHash} == ${this.blockchain[i - 1].hash} : ${(this.blockchain[i].prevHash != this.blockchain[i - 1].hash ? 'Different Hash' : 'Same Hash')}`);
            }
            if (this.blockchain[i].prevHash != this.blockchain[i - 1].hash) return false;
        }
        return true;
    }

    /**
     * Returns the Blocks in the Blockchain.
     * @returns {Array}
     */
    return_blocks() {
        return this.blockchain;
    }

    /**
     * Returns the Blockchain Reference.
     * @returns {Object}
     */
    return_reference() {
        return this.blockchainReference;
    }
}

export {
    Block,
    Blockchain,
}