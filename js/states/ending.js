var Ending = function(game){
};

Ending.prototype = {
	init: function(params){
	},
	preload: function(){
	},
	create: function(){
		var game = this.game;
		game.state.remove("GameState");
		game.state.add("GameState", GameState);

		var w = this.scale.width;
		var h = this.scale.height;
		this.add.tileSprite(0, 0, w, h, "ending-bg");

		// Play!
		game.add.button(game.world.centerX - 95, game.world.centerY * 1.5, 'button', this.actionOnClick, this, 2, 1, 0);
	},
	actionOnClick: function(){
		this.game.state.start("GameState");
	},
	update: function(){
	},
	render: function(){
	},
	shutdown: function(){
	}
}
