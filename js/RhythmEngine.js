var RhythmEngine = function(timer, length, grace){
	this.timerLength = length;
	this.grace = grace;

	this.timer = timer;
	this.timer.loop(this.timerLength, this.endTimer, this);

	this.keyHit = false;
	this.lastKey = null;

	this.timer.start();
	this.key = null;;

	this.onHit = new Phaser.Signal();
	this.onMiss = new Phaser.Signal();
};


RhythmEngine.prototype = {
	//accuracy
	HIT: "hit",
	MISS: "miss",

	missStep: function(){
		this.onMiss.dispatch(this.MISS);
	},

	hitStep: function(){
		this.onHit.dispatch(this.HIT);
	},

	step: function(e){
		var key = e.keyCode;
		var ms = this.timer.ms;
		var failed = false;

		//time in beat shifted by stepGrace
		var delta = ms%this.timerLength - (this.timerLength - this.grace);

		//hit same key or wrong time
		if(this.keyHit || key == this.lastKey || Math.abs(delta) > this.grace){
			this.missStep();
			failed = true;
		}
		else{
			this.hitStep();
		}

		this._keyToHit = this.lastKey;
		this.keyHit = true;

		this.lastKey = null;
		if(!failed)
			this.lastKey = key;
	},


	endTimer: function(){
		if(!this.keyHit){
			this.missStep();
		}
		this.keyHit = false;
	},

	getMs: function(){
		return this.timer.ms;
	},

	getDelta: function(){
		return this.timer.ms % this.timerLength - (this.timerLength - this.grace);
	},

	getAccuracy: function(){
		if(Math.abs(this.getDelta()) > this.grace){
			return this.MISS;
		}
		return this.HIT;
	}
}