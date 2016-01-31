AudioManager = function(game){
	this.game = game;

	this.priest;
	this.conga;
	this.eGuitar;
	this.trumpet;
	this.aGuitar;
	this.sax;
	this.drums;
};

AudioManager.prototype.constructor = AudioManager;

AudioManager.prototype = {
	playAllTracks: function(){
		this.priest.play("", 0, 0);
		this.conga.play("", 0, 0);
		this.eGuitar.play("", 0, 0);
		this.trumpet.play("", 0, 0);
		this.aGuitar.play("", 0, 0);
		this.sax.play("", 0, 0);
		this.drums.play("", 0, 0);
	},
};
