const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockchainClass = require('./Blockchain.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} server 
     */
    constructor(app) {
        this.app = app;
        this.chain = new BlockchainClass.Blockchain();
        this.initializeMockData(this.chain);
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", async (req, res) => {
                    try {
                        const block = await this.chain.getBlock(req.params.index);
                        let block_str = JSON.stringify(block).toString();
                        res.status(200);
                        res.send(JSON.parse(block_str));
                    } catch (err) {
                        res.status(404);
                        res.send(err);
                    }
        });            
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", async (req, res) => {
                if (Object.keys(req.body).length === 0) {
                    res.status(400);
                    return res.send('Missing input json in Body');
                }
                if (req.body.body === void 0) {
                    res.status(400);
                    return res.send('No body field in input json');
                }
                if (req.body.body === "") {
                    res.status(400);
                    res.send('Empty body field in input json');
                }
                let blockAux = new BlockClass.Block(req.body.body);
                try {
                    blockAux.height = await this.chain.getBlockHeight();
                    blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                    const result = await this.chain.addBlock(blockAux);
                    console.log(result);
                    res.status(201);      
                    return res.send(result);
                } catch (err) {
                    res.status(500);
                    return res.send(err);
                }             
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    async initializeMockData(chain) {
        for (let index = 1; index <= 10; index++) {                
            let blockAux = new BlockClass.Block(`Test Data #${index}`);
            try {
                let result = await chain.addBlock(blockAux);
                console.log(result);
            } catch (err) {
            }
        }
        //this.chain.validateChain();
    }
    
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}