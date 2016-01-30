var Preload = function(game){
};
 
Preload.prototype = {
	/* State methods */
	init: function(params){
	},
	loadImages: function() {

	},
	preload: function(){
		this.loadImages();
	},
	create: function(){
		var game = this.game;
		game.state.start("MainMenu");
	},
	update: function(){
	},
	render: function(){
	},
	shutdown: function(){
	}
}