const ValidationRequest = require('./ValidRequest');
const IncomingRequest = require('./RequestObject.js');
const EHandler = require('./ErrorHandler.js');

const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

const TimeoutRequestsWindowTime = 5*60*1000;
//const TimeoutMempoolValidWindowTime = 30*60*1000;

/* ===== Block Class ==============================
|  Mempool Class - stores validation request's     |
|  ===============================================*/

class Mempool {
    constructor(){
        this.mempool = new Map();
        this.timeoutRequests = new Map();
        this.mempoolValid = new Map();
        this.timeoutMempoolValid = new Map();
    }    

    AddRequestValidation(wAddress){
        let poolObject = this.timeoutRequests.get(wAddress);
        
        if  (poolObject === void 0) {
            let respObject = new IncomingRequest.RequestObject();
            respObject.walletAddress = wAddress;
            respObject.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
            respObject.message = respObject.walletAddress + ":" + respObject.requestTimeStamp + ":" + "starRegistry";
            respObject.validationWindow = TimeoutRequestsWindowTime/1000;

            this.mempool.set(respObject.walletAddress,respObject);
            
            let self = this;
            self.timeoutRequests.set(respObject.walletAddress,setTimeout(function(){ self.removeValidationRequest(respObject.walletAddress) }, TimeoutRequestsWindowTime));
            return respObject;
        } else {
            let respObject = this.mempool.get(wAddress);
            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - respObject.requestTimeStamp;
            let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
            respObject.validationWindow = timeLeft;
            this.mempool.set(respObject.walletAddress,respObject);
            return respObject;
        }
    }

    removeValidationRequest(walletAddress) {
        this.mempool.delete(walletAddress);
        this.timeoutRequests.delete(walletAddress);
    }

    ValidateRequestByWallet(walletAddress,signature){
        //Find your request in the mempool array by wallet address.
        let poolObject = this.mempool.get(walletAddress);
        
        if  (poolObject === void 0) {
            //return no request available
            return new EHandler.ErrorHandler("No request with such address in the pool");
        }

        //Verify your windowTime - really? should be removed by timeout...
        let curTimeStamp = new Date().getTime().toString().slice(0,-3);
        if  (curTimeStamp - poolObject.requestTimeStamp >= poolObject.validationWindow) {
            return new EHandler.ErrorHandler("Validation window for request has been elapsed");
        }

        //Verify the signature
        let isValid = bitcoinMessage.verify(poolObject.message, poolObject.walletAddress, signature);
        //Create the new object and save it into the mempoolValid array
        if (isValid) {
            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - poolObject.requestTimeStamp;
            let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
            let retValidRequest = new ValidationRequest.ValidRequest(poolObject,timeLeft);
        
            //If you have implemented a timeoutArray, make sure you clean it up before returning the object.
            this.removeValidationRequest(walletAddress);
            this.mempoolValid.set(retValidRequest.status.walletAddress,retValidRequest);

            return retValidRequest;
        } 
        //return signature not vaild
        return new EHandler.ErrorHandler("Signature is not valid!");
    }

    RemoveValidRequest(walletAddress){
        this.mempoolValid.delete(walletAddress);
    }

    verifyAddressRequest (walletAddress) {        
        if (this.mempoolValid.has(walletAddress)) {
            return true;
        }
        return false;
    }

}

module.exports.Mempool = Mempool;