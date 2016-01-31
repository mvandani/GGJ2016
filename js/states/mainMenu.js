var MainMenu = function(game){
};

MainMenu.prototype = {
	/* State methods */
	init: function(params){
	},
	preload: function(){
		var game = this.game;
		game.load.spritesheet('player', 'assets/player.png', 174, 234, 10);
		game.load.spritesheet('player-drag', 'assets/player-drag.png', 317, 212, 3);
		game.load.spritesheet('runner', 'assets/runner.png', 174, 234, 3);
		game.load.image("ground", "assets/lava-ground.png");
		game.load.image("root-x", "assets/root-x.png");
		game.load.image("root", "assets/root.png");
		game.load.image("mountains", "assets/mountains.png");
		game.load.image("sky", "assets/sky.png");
		game.load.image("hill", "assets/hill.png");
		game.load.image("menu-bg", "assets/mainmenu.jpg");
		game.load.image("loss", "assets/loss.jpg");
		game.load.image("win", "assets/win.jpg");
		game.load.spritesheet("priests", "assets/priests.png", 267, 200, 2);
		game.load.spritesheet('button', 'assets/buttons/start_button.png', 202, 171);
		game.load.spritesheet("retry_button", "assets/buttons/retry_button.png", 202, 171);
	},
	create: function(){
		var game = this.game;
		var w = this.scale.width;
		var h = this.scale.height;
		this.add.tileSprite(0, 0, w, h, "menu-bg");

		// Play!
		game.add.button(40, game.world.centerY - 40, 'button', this.actionOnClick, this, 1, 0, 1);
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