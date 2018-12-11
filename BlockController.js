const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const MempoolClass = require('./Mempool.js');
const StarClass = require('./Star.js');
const BlockchainClass = require('./Blockchain.js');
const EHandler = require('./ErrorHandler.js');


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
        this.pool = new MempoolClass.Mempool();
        //this.initializeMockData(this.chain);
        this.getBlockByIndex();
        this.getBlockByHash();
        this.getBlockByWallet();
        this.postNewBlock();
        this.createRequest();        
        this.performValidation();        
    }

    /**
     * Submitting a validation request Endpoint url: "/requestValidation"
     */
    createRequest() {
        this.app.post("/requestValidation", (req, res) => {
            if (Object.keys(req.body).length === 0) {
                res.status(400);
                return res.send('Missing input json in Body');
            }
            if (req.body.address === void 0) {
                res.status(400);
                return res.send('No address field in input json');
            }
            if (req.body.address === "") {
                res.status(400);
                res.send('Empty address field in input json');
            }
            let retObj = this.pool.AddRequestValidation(req.body.address);
            let request_str = JSON.stringify(retObj).toString();
            res.status(200);
            res.send(JSON.parse(request_str));
        });
    }

    /**
     * User sends a validation request url: "/message-signature/validate"
     */
    performValidation() {
        this.app.post("/message-signature/validate", (req, res) => {
            if (Object.keys(req.body).length === 0) {
                res.status(400);
                return res.send('Missing input json in Body');
            }
            if (req.body.address === void 0 || req.body.signature === void 0) {
                res.status(400);
                return res.send('No address / signature field in input json');
            }
            if (req.body.address === "" || req.body.signature === "") {
                res.status(400);
                res.send('Empty address field in input json');
            }
            let msg = 'Request accepted ' + req.body.address; 
            let retObj = this.pool.ValidateRequestByWallet(req.body.address, req.body.signature);
            if (retObj.errorMessage === void 0) {
                res.status(200);
            } else {
                res.status(500);
            }
            let reuest_str = JSON.stringify(retObj).toString();
            res.send(JSON.parse(reuest_str));
        });
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", async (req, res) => {
            try {
                let block = await this.chain.getBlock(req.params.index);
                if (block.height != 0){	
                    let newStar = new StarClass.Star(block.body.star);
                    block.body.star = newStar;
                    block.body.star.DecodeStarStory();
                }
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
     * Implement a GET Endpoint to retrieve a block by hash, url: "/block/hash/:hash"
     */
    getBlockByHash() {
        this.app.get("/block/hash/:hash", async (req, res) => {
            try {
                let block = await this.chain.getBlockByHash(req.params.hash);
                if (block.height != 0){	
                    let newStar = new StarClass.Star(block.body.star);
                    block.body.star = newStar;
                    block.body.star.DecodeStarStory();
                }
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
     * Implement a GET Endpoint to retrieve a block by wallet address, url: "/block/address/:address"
     */
    getBlockByWallet() {
        this.app.get("/block/address/:address", async (req, res) => {
            try {
                let block = await this.chain.getBlockByWalletAddress(req.params.address);
                let block_str = [];
                for (var i = 0; i < block.length ; i++) {
                    let newStar = new StarClass.Star(block[i].body.star);
                    block[i].body.star = newStar;
                    block[i].body.star.DecodeStarStory();
                    block_str[i] = JSON.parse(JSON.stringify(block[i]).toString());
                }
                res.status(200);
                res.send(block_str);
            } catch (err) {
                res.status(404);
                res.send(err);
            }
        });            
    }


    /**
     * Implement a POST Endpoint to add a new Block, url: "/block"
     */
    postNewBlock() {
        this.app.post("/block", async (req, res) => {
            if (Object.keys(req.body).length === 0) {
                res.status(400);
                return res.send('Missing input json in Body');
            }
            if (req.body.address === void 0 || req.body.star === void 0) {
                res.status(400);
                return res.send('No Address / Start field in input json');
            }
            if (req.body.address === "" || req.body.star === "") {
                res.status(400);
                return res.send('Empty body field in input json');
            }
            
            let newStar = new StarClass.Star(req.body.star);
            newStar.EncodeStarStory();

            if (!newStar.ValideStar()) {
                res.status(400);
                return res.send('Star is not the right format');
            }

            if (!this.pool.verifyAddressRequest(req.body.address)){
                res.status(400);
                return res.send('No Valid request exist');
            }

            let blockAux = new BlockClass.Block();
            blockAux.body = {}
            blockAux.body.star = newStar;
            blockAux.body.address = req.body.address;
            try {
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                const result = await this.chain.addBlock(blockAux);
                this.pool.RemoveValidRequest(req.body.address);
                blockAux.body.star.DecodeStarStory();
                res.status(201);      
                return res.send(blockAux);
            } catch (err) {
                res.status(500);
                return res.send(err);
            }             
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    // async initializeMockData(chain) {
    //     for (let index = 1; index <= 10; index++) {                
    //         let blockAux = new BlockClass.Block(`Test Data #${index}`);
    //         try {
    //             let result = await chain.addBlock(blockAux);
    //             console.log(result);
    //         } catch (err) {
    //         }
    //     }
    //     //this.chain.validateChain();
    // }
    
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}