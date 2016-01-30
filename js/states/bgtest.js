var BGTestState = function(game){
	this.speed = 20;

	this.mountain = null; // group of everything moving...
	this.bgtile = null;
};
 
BGTestState.prototype = {
	init: function(params){
		//this.stage.disableVisibilityChange = false; // no outside pause
	},
	preload: function(){
		this.load.image("bgtile", "assets/hills.png");
		this.load.image("root", "assets/root.png");
	},
	create: function(){
		var w = this.scale.width;
		var h = this.scale.height;
		var m = this.mountain = this.add.sprite(w / 2, h / 2, "root");

		this.bgtile = this.make.tileSprite(-w * 2, 0, w * 4, h, "bgtile");
		m.addChild(this.bgtile);

		this.input.onDown.add(function(){
			m.rotation -= 0.05;
		}, this);
	},
	update: function(){
		this.bgtile.tilePosition.x += this.speed;
	},
	render: function(){
		this.game.debug.text(this.mountain.rotation, 10, 20);
	},
	shutdown: function(){
	}
}
