import { Blockchain, Block } from 'boredom-blockchain';

const chain1 = new Blockchain(true);
for (let i = 0; i < 99; i++) {
    chain1.insert_block({
        value: i,
    }, i);
}

const chain2 = new Blockchain(true);
for (let i = 0; i < 99; i++) {
    chain2.insert(new Block(
        i,
        {
            value: i,
        },
        Date.now(),
        '0000',
    ));
}

console.log(chain1.verify());
console.log(chain2.verify());