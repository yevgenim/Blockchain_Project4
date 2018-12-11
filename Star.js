const hex2ascii = require('hex2ascii');

/* ===== RequestObject Class ==============================
|  Class with a constructor for Start 			   |
|  =======================================================*/

class Star{
	constructor(data){
        if (data.ra) this.ra = data.ra;
        if (data.dec) this.dec = data.dec;
        if (data.mag) this.mag = data.mag;
        if (data.cen) this.cen = data.cen;
        this.story = data.story;
    }


    ValideStar(){
        if (this.dec === void 0 && this.ra === void 0 && this.mag === void 0 && this.cen === void 0) {
            return false;
        }
        if (this.story > 500) {
            return false; 
        }
        return true;
    }

    DecodeStarStory(){
        this.storyDecoded = hex2ascii(this.story);
    }

    EncodeStarStory(){
        this.story = Buffer.from(this.story).toString('hex');
    }
}


    module.exports.Star = Star;