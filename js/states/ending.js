var Ending = function(game){
	this.params = null;
	this.winScore = 10000;
	this.song;
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
		this.song = this.game.add.audio(this.params.score >= this.winScore ? 'goodEnd' : 'badEnd');

		var game = this.game;
		game.state.remove("GameState");
		game.state.add("GameState", GameState);

		var w = this.scale.width;
		var h = this.scale.height;
		this.add.tileSprite(0, 0, w, h, this.params.score >= this.winScore ? "win" : "loss");

		// if(this.params.score >= this.winScore)
			this.song.play();
		// else
		// 	this.badSong.play(0.5)

		// Play!
		game.add.button(w - 250, h - 170, "retry_button", this.actionOnClick, this, 1, 0, 1);
	},
	actionOnClick: function(){
		this.song.stop();
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
