/* ===== RequestObject Class ==============================
|  Class with a constructor for RequestObject 			   |
|  ========================================================*/

class RequestObject{
	constructor(){
     this.walletAddress = "",
     this.requestTimeStamp = "",
     this.message = "",
     this.validationWindow = ""
    }
}
    
module.exports.RequestObject = RequestObject;