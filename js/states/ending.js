var Ending = function(game){
	this.params = null;
	this.winScore = 10000;
	this.goodSong;
	this.badSong;
};

Ending.prototype = {
	init: function(params){
		this.params = params || {
			// defaults
			score: 0,
		};
	},
	preload: function(){
	},
	create: function(){
		this.goodSong = this.game.add.audio('goodEnd');
		this.badSong = this.game.add.audio('badEnd');
		var game = this.game;
		game.state.remove("GameState");
		game.state.add("GameState", GameState);

		var w = this.scale.width;
		var h = this.scale.height;
		this.add.tileSprite(0, 0, w, h, this.params.score >= this.winScore ? "win" : "loss");

		// if(this.params.score >= this.winScore)
			this.goodSong.play(0.5);
		// else
		// 	this.badSong.play(0.5)

		// Play!
		game.add.button(w - 250, h - 170, "retry_button", this.actionOnClick, this, 1, 0, 1);
	},
	actionOnClick: function(){
		this.goodSong.stop();
		this.badSong.stop();
		this.game.state.start("GameState");
	},
	update: function(){
	},
	render: function(){
		this.game.debug.text(this.params.score, 10, 20, "#000");
	},
	shutdown: function(){
	}
}
