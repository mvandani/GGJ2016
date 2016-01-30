var BGTestState = function(game){
	this.bgtile = null;
	this.speed = 1;
};
 
BGTestState.prototype = {
	init: function(params){
	},
	preload: function(){
	},
	create: function(){
		var game = this.game;
		this.bgtile = game.add.tileSprite(0, 0, this.scale.width, this.scale.height, "bgtile");
	},
	update: function(){
		this.bgtile.tilePosition.x -= this.speed;
	},
	render: function(){
	},
	shutdown: function(){
	}
}
