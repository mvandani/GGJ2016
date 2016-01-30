var BGTestState = function(game){
	this.speed = 20;

	this.mountain = null; // group of everything moving...
	this.bgtile = null;
};
 
BGTestState.prototype = {
	init: function(params){
		this.stage.disableVisibilityChange = false; // no outside pause
	},
	preload: function(){
	},
	create: function(){
		this.mountain = this.add.group(this.world, "mountain");

		var tileWidth = this.cache.getImage('bgtile').width; // this.scale.width
		var tileHeight = this.cache.getImage('bgtile').height; // this.scale.height
		this.bgtile = this.add.tileSprite(0, 0, tileWidth, tileHeight, "bgtile", null, this.mountain);
	},
	update: function(){
		this.bgtile.tilePosition.x -= this.speed;
	},
	render: function(){
	},
	shutdown: function(){
	}
}
