var Preload = function(game){
};
 
Preload.prototype = {
	/* State methods */
	init: function(params){
	},
	preload: function(){
		this.game.stage.backgroundColor = "0x000000";

		// Priests
		this.game.load.image('priest_1', 'assets/images/Priest 1.png');
		this.game.load.image('priest_2', 'assets/images/Priest 2.png');
		this.game.load.image('priest_3', 'assets/images/Priest 3.png');
		this.game.load.image('priest_4', 'assets/images/Priest 3.png');
		this.game.load.image('priest_5', 'assets/images/Priest 3.png');
		this.game.load.image('priest_6', 'assets/images/Priest 3.png');
		this.game.load.image('priest_7', 'assets/images/Priest 3.png');

		this.game.load.image('up', 'assets/images/up.png');
		this.game.load.image('down', 'assets/images/down.png');
		this.game.load.image('left', 'assets/images/left.png');
		this.game.load.image('right', 'assets/images/right.png');

		// Backgrounds
		this.game.load.image('game_bg', 'assets/images/Title without text.png');

		// Particles
		this.game.load.image('key_particle', 'assets/images/particle.png');

		this.game.load.json('iconLookup', 'assets/data/keyIconLookup.json');
        //this.game.state.start("MainMenu");
	},
	create: function(){
		// For the particles
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.game.state.start("MainMenu");
	},
	update: function(){
	},
	render: function(){
	},
	shutdown: function(){
	}
}