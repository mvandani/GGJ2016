var RhythmEngine = function(timer, degradeTime, keyPairs){
	this.degradeTime = degradeTime;

	this.timer = timer;
	this.timer.loop(degradeTime, this.endTimer, this);
	this.timer.start();

	this.keyPairs = keyPairs;
	this.keyIndex = 0;
	this.pairIndex = Math.floor((Math.random() * keyPairs.length));
	keyPairs[this.pairIndex][0].onDown.add(this.step, this);
	keyPairs[this.pairIndex][1].onDown.add(this.step, this);

	this.isStarting = true;

	this.onHit = new Phaser.Signal();
	this.onMiss = new Phaser.Signal();
	this.onDegrade = new Phaser.Signal();
};


RhythmEngine.prototype = {
	//accuracy
	HIT: "hit",
	MISS: "miss",

	missStep: function(key){
		this.onMiss.dispatch({"key": key, "i": this.keyIndex});
	},

	hitStep: function(key){
		this.onHit.dispatch({"key": key, "i": this.keyIndex});
	},

	step: function(e){
		var key = e;
		var ms = this.timer.ms;

		if (key == this.keyPairs[this.pairIndex][this.keyIndex]) {
			this.hitStep(key);
		} else {
			if (this.isStarting) {
				this.keyIndex = (this.keyIndex+1)%2;
				this.isStarting = false;
			} else {
				//let them start however they want next time
				this.isStarting = true;
			}
			this.missStep(key);
		}
		this.keyIndex = (this.keyIndex+1)%2;
	},

	getPair: function(){
		return this.keyPairs[this.pairIndex];
	},

	endTimer: function(){
		this.onDegrade.dispatch(this.MISS);
		if(Math.floor(this.timer.ms / this.degradeTime) % 10 == 0){
			this.keyPairs[this.pairIndex][0].onDown.remove(this.step, this);
			this.keyPairs[this.pairIndex][1].onDown.remove(this.step, this);
			this.pairIndex = Math.floor((Math.random() * this.keyPairs.length));
			this.keyPairs[this.pairIndex][0].onDown.add(this.step, this);
			this.keyPairs[this.pairIndex][1].onDown.add(this.step, this);
		}
	},
}