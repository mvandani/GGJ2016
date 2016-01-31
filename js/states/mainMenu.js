var MainMenu = function(game){
};
 
MainMenu.prototype = {
	/* State methods */
	init: function(params){
	},
	preload: function(){
		var game = this.game;
		game.load.spritesheet('player', 'assets/player.png', 174, 234, 10);
		game.load.spritesheet('runner', 'assets/runner.png', 174, 234, 3);
		game.load.image("ground", "assets/lava-ground.png");
		game.load.image("root-x", "assets/root-x.png");
		game.load.image("root", "assets/root.png");
		game.load.image("mountains", "assets/mountains.png");
		game.load.image("sky", "assets/sky.png");
		game.load.image("hill", "assets/chanter-hill.gif");
		game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
	},
	create: function(){
		var game = this.game;
		var w = this.scale.width;
		var h = this.scale.height;
		this.add.tileSprite(0, 0, w, h, "sky");

		// Play!
		game.add.button(game.world.centerX - 95, game.world.centerY * 1.5, 'button', this.actionOnClick, this, 2, 1, 0);

		// Title
		var titleProps = {
			font: "65px Arial",
			fill: "#fff",
			align: "center"
		};
		var title = game.add.text(game.world.centerX, game.world.centerY / 2, "Escape the Volcano", titleProps);
		title.anchor.setTo(0.5, 0.5);
		title.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
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