var BGTestState = function(game){
	this.bgtile = null;
	this.speed = 20;
};
 
BGTestState.prototype = {
	init: function(params){
	},
	preload: function(){
	},
	create: function(){
		var game = this.game;
		var tileHeight = game.cache.getImage('bgtile').height; // this.scale.height
		this.bgtile = game.add.tileSprite(0, 0, this.scale.width, tileHeight, "bgtile");
	},
	update: function(){
		this.bgtile.tilePosition.x -= this.speed;
	},
	render: function(){
	},
	shutdown: function(){
	}
}
