AudioManager = function(game){
	this.game = game;

	this.track1;
	this.track2;
	this.track3;
	this.track4;
	this.track5;
	this.track6;
	this.track7;
};

AudioManager.prototype.constructor = AudioManager;

AudioManager.prototype = {
	setUpTracks: function(){
		this.randomTracks = [this.track2, this.track3, this.track4, this.track5, this.track6, this.track7];
		this.track1.play("", 0, 0);
		this.track2.play("", 0, 0);
		this.track3.play("", 0, 0);
		this.track4.play("", 0, 0);
		this.track5.play("", 0, 0);
		this.track6.play("", 0, 0);
		this.track7.play("", 0, 0);
	},
	getRandomTrack: function(){
		var randIndex = this.game.rnd.integerInRange(0, this.randomTracks.length - 1);
		return this.randomTracks.splice(randIndex, 1)[0];
	},
};
