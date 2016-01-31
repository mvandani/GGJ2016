var Ending = function(game){
};

Ending.prototype = {
	init: function(params){
	},
	preload: function(){
	},
	create: function(){
		var w = this.scale.width;
		var h = this.scale.height;
		this.add.tileSprite(0, 0, w, h, "ending-bg");
	},
	update: function(){
	},
	render: function(){
	},
	shutdown: function(){
	}
}
