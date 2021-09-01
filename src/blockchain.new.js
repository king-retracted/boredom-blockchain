import sha256 from 'crypto-js/sha256.js';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

class Block {
    constructor(index, data, timestamp, prevHash) {
        this.index = index;
        this.data = data;
        this.timestamp = timestamp;
        this.prevHash = prevHash;

        if (index == 0) this.prevHash = '0';

        this.hash = this.compute_hash();
    }

    compute_hash() {
        return sha256(`${this.index}x${JSON.stringify(this.data)}x${this.timestamp}x${this.prevHash}`).toString();
    }
}

class Blockchain {
    constructor(debugMode = false) {
        this.blockchain = [];
        this.blockchainReference = {};
        this.currentIndex = 0;
        this.debugMode = debugMode;
    }

    insert(block, name) {
        this.blockchainReference[name] = this.currentIndex;
        this.blockchain.push(block);
        this.currentIndex++;
    }

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

    search(name) {
        return this.blockchain[this.blockchainReference[name]];
    }

    extract(name, point) {
        if (!this.search(name).hasOwnProperty(point)) return;
        if (point.toLowerCase() == 'data') return JSON.parse(this.search(name)[point]);
        return this.search(name)[point]
    }

    verify() {
        for (let i = 1; i < this.blockchain.length; i++) {
            if (this.debugMode) {
                console.log(`[${i}] - ${this.blockchain[i].prevHash} == ${this.blockchain[i - 1].hash} : ${(this.blockchain[i].prevHash != this.blockchain[i - 1].hash ? 'Different Hash' : 'Same Hash')}`);
            }
            if (this.blockchain[i].prevHash != this.blockchain[i - 1].hash) return false;
        }
        return true;
    }

    export(path) {
        const timestamp = Date.now();
        const folderComp = path;
        if (!fs.existsSync(folderComp)) fs.mkdirSync(folderComp);
        const filename = (process.platform == 'win32') ? `${folderComp}\\${timestamp}-export-blockchain.txt` : `${folderComp}/${timestamp}-export-blockchain.txt`;
        const HEADER_INFO = `
            # Running OS: ${process.platform} with ${process.version}.
            # Blockchain Length: ${this.blockchain.length}.
            ## AUTO-GENERATED ##
            # BEGIN-BLOCKCHAIN #
        `;
        const BLOCK_INFO = [];
        console.log(HEADER_INFO);
        for (let elem of this.blockchain) {
            const construct_string = `${elem.index} | ${JSON.stringify(elem.data)} | ${elem.timestamp} | ${elem.prevHash} | ${elem.hash}`
            BLOCK_INFO.push(construct_string);
        }
        fs.writeFileSync(filename, HEADER_INFO + '\r\n' + BLOCK_INFO.join('\r\n').toString().trim());
    }

    import(file_path, recalculateHash=false) {
        const fileElem = fs.readFileSync(file_path).toString().split('\r\n').slice(7);

        for (let elem of fileElem) {
            const [ index, data, timestamp, prevHash, hash, name ] = elem.toString().split(' | ');
            const nameAttr = JSON.parse(JSON.parse(data))['name'];

            if (recalculateHash) {
                this.insert_block(
                    JSON.parse(JSON.parse(data)),
                    (nameAttr != undefined) ? nameAttr : index,
                );
            } else {
                this.insert(new Block(
                        parseInt(index),
                        JSON.parse(JSON.parse(data)),
                        timestamp,
                        (this.blockchain.length > 0) ? this.blockchain[this.currentIndex - 1].hash : '0',
                    ),
                    (nameAttr != undefined) ? nameAttr : index,
                );
            }
        }
    }

    return_blocks() {
        return this.blockchain;
    }

    return_reference() {
        return this.blockchainReference;
    }
}

export {
    Block,
    Blockchain,
}