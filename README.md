# boredom-blockchain
A Blockchain framework thing I made because I was bored.

# Usage
To create a new Blockchain, import the ``Blockchain`` class.
```js
import { Blockchain } from 'boredom-blockchain';

const chain = new Blockchain(debugMode=false);
```

``debugMode`` will enable console logging everytime a block is a created and verified.
![screenshot](https://cdn.discordapp.com/attachments/812448501505327114/881715264356511784/unknown.png)

# Creating a new Block
You can create a new Block using the ``Block`` class or using the ``insert_block()`` function. 

The ``insert_block()`` function takes the parameters ``data`` Object and ``name`` String.

The ``insert()`` function takes the parameter ``block`` Block and ``name`` String. This is not recommended as it is more complex and not properly integrated for the Blockchain. 

```js
import { Blockchain, Block } from 'boredom-blockchain';

const chain = new Blockchain();
chain.insert_block({
    name: 'Ella',
}, 'ella');
chain.insert(new Block(
    1, // Index
    {
        name: 'Jerry',
    }, // Data
    Date.now(), // Timestamp
    prevHash, // Previous Hash
), 'jerry');
```

## Viewing the Blockchain and a Block
You can view the entire Blockchain using the ``return_blocks()`` function. It will return the Array with each element being a ``Block``. 
```js
console.log(chain.return_blocks());
```

You can view the entire Blockchain reference using the ``return_reference()`` function. It will return an object with each key being the ``name`` and the value being the numerical index.
```js
console.log(chain.return_reference());
```

You can search for a Block using the ``search()`` function which takes the parameter ``name`` String. It will return a ``Block`` containing all of the data and metadata of the Block.
```js
console.log(chain.search('ella'));
```

You can search for a specific property of a Block using the ``extract()`` function which takes the parameters ``name`` String and ``point`` String. It will return either a ``number``, ``string,`` or ``Object`` depending on what ``point`` you choose. The point is just the name of the property of the Block.
```js
console.log(chain.extract('ella', 'data')); // Returns: { name: 'Ella' }
```

## Verifying the Blockchain
You can verify the Blockchain using the ``verify()`` function which will return a ``Boolean`` which is the integrity of the Blockchain. It will always result in ``true`` if you use the ``insert_block()`` function as ``insert_block()`` is already computed while ``insert(Block)`` must be manually computed. It is up to the developer to create secure practices for inserting blocks to the Blockchain.
```js
console.log(chain.verify());

if (chain.verify() == true) {
    console.log('The Blockchain is validated');
}
```

# Exporting/Importing a Blockchain
!!! These functions are only in the ``blockchain.new.js`` file. (Developer Module)

To export a Blockchain, call the ``export(path='output')`` function which will create a new folder and file with the folder ``path`` (default: output)

To import a Blockchain, call the ``import(path, recalculateHash=false)`` function with the path being the path of the **file**. If you enable the ``recalcuateHash``, it will recalculate the hash of the block.

```js
chain.import(`${__dirname}/src/output/1630463485137-export-blockchain.txt`);
chain.export(`${__dirname}/output`); // output folder in the Root directory
```

# To Do
- Turn this from a project made out of boredom to a project worth maintaining and pushing forward [ ✅ ]
- Enable a more customizable Blockchain. [ 🚫 ]
- Introduce settings parameter for the creation of the Blockchain. [ 🚫 ]
- Exporting/Importing a Blockchain. [ 🟡 ]
- Support for verifiying across a p2p network. [ 🚫 ]
- Introducing a Proof-of-Work to the framework. [ 🚫 ]
- Automatic verifiction every ``x`` minutes. [ 🚫 ]
- Rate limiting on the creation of blocks in the network (proof-of-work). [ 🚫 ]
- Add more security features. [ 🚫 ]
- Fix ugly documentation. [ 🚫 ]

# Contributing
```js
// This section is empty
```

# License
This project is under the ``MIT License``. You can view it in the ``LICENSE`` file.

---

Version: 1.0.6