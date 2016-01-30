var Preload = function(game){
};
 
Preload.prototype = {
	/* State methods */
	init: function(params){
	},
	preload: function(){
		this.game.stage.backgroundColor = "0xFFFFFF";
		// Use the script loader to avoid bloating the index with includes
		/*
		this.game.load.script('priestGroup.js', 'js/priestGroup.js');
		this.game.load.script('priest.js', 'js/priest.js');
		this.game.load.script('worshipperGroup.js', 'js/worshipperGroup.js');
		*/

		this.game.load.image('priest', 'assets/images/priest-1.png');
		this.game.load.image('up', 'assets/images/up.png');
		this.game.load.image('down', 'assets/images/down.png');
		this.game.load.image('left', 'assets/images/left.png');
		this.game.load.image('right', 'assets/images/right.png');

		this.game.load.json('iconLookup', 'assets/data/keyIconLookup.json');
	},
	create: function(){
		this.game.state.start("GameState");
	},
	update: function(){
	},
	render: function(){
	},
	shutdown: function(){
	}
}