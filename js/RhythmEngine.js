var RhythmEngine = function(timer, degTime, keyPairs){
	this.timer = timer;

	this.degTime = degTime;
	this.timer.loop(degTime, this.endTimer, this);
	this.timer.start();


	this.keyPairs = keyPairs;

	// for(var i = 0; i < keyPairs.length; i++){
	// 	keyPairs[i]
	// }
	keyPairs[0][0].onDown.add(this.step, this);
	keyPairs[0][1].onDown.add(this.step, this);

	this.keyIndex = 0;
	this.pairIndex = 0;

	this.isStarting = true;

	this.onHit = new Phaser.Signal();
	this.onMiss = new Phaser.Signal();
	this.onDeg = new Phaser.Signal();
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
		var key = e;
		var ms = this.timer.ms;

		if(key == this.keyPairs[this.pairIndex][this.keyIndex]){
			this.hitStep();
		}
		else{
			if(this.isStarting){
				this.keyIndex = (this.keyIndex+1)%2;
				this.isStarting = false;
			}
			else
				//let them start however they want next time
				this.isStarting = true;

			this.missStep();
		}

		this.keyIndex = (this.keyIndex+1)%2;
	},

	getPair: function(){
		return this.keyPairs[this.pairIndex];
	},


	endTimer: function(){
		var keyPairs = this.keyPairs;
		var pairIndex = this.pairIndex;
		this.onDeg.dispatch(this.MISS)
		if(Math.floor(this.timer.ms/this.degTime)%10 == 0){
			keyPairs[pairIndex][0].onDown.remove(this.step, this);
			keyPairs[pairIndex][1].onDown.remove(this.step, this);
			this.pairIndex = Math.floor((Math.random() * keyPairs.length));
			keyPairs[pairIndex][0].onDown.add(this.step, this);
			keyPairs[pairIndex][1].onDown.add(this.step, this);
		}
	},
}