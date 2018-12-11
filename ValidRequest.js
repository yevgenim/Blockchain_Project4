const IncomingRequest = require('./RequestObject');

/* ===== VaildRequest Class ==============================
|  Class with a constructor for ValidRequest 			   |
|  ========================================================*/

class ValidRequest{
	constructor(reqObj,newValidationWindow){
        this.registerStar =  true;
        this.status = new IncomingRequest.RequestObject();
        this.status.walletAddress = reqObj.walletAddress;
        this.status.requestTimeStamp = reqObj.requestTimeStamp;
        this.status.message = reqObj.message;
        this.status.validationWindow = newValidationWindow;
        this.status.messageSignature = true;
    }
}
    
module.exports.ValidRequest = ValidRequest;