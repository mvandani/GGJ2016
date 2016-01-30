var MainMenu = function(game){
};
 
MainMenu.prototype = {
	/* State methods */
	init: function(params){
	},
	preload: function(){
		var game = this.game;
		game.load.spritesheet('player', 'assets/player.png', 174, 234, 8);
		game.load.image('runner', 'assets/runner.png');
		game.load.image("ground", "assets/lava-ground.png");
		game.load.image("root", "assets/root-x.png");
		game.load.image("mountains", "assets/mountains.png");
		game.load.image("sky", "assets/sky.png");
		game.load.image("hill", "assets/chanter-hill.gif");
	},
	create: function(){
		var game = this.game;
		game.state.start("GameState");
	},
	update: function(){
	},
	render: function(){
	},
	shutdown: function(){
	}
}