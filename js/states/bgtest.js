var BGTestState = function(game){
	this.speed = 20;

	this.dispRoot = null; // group of everything moving...
	this.ground = null;
	this.mountains = null;
};
 
BGTestState.prototype = {
	init: function(params){
		//this.stage.disableVisibilityChange = false; // no outside pause
	},
	preload: function(){
		this.load.image("ground", "assets/lava-ground.png");
		this.load.image("root", "assets/root-x.png");
		this.load.image("mountains", "assets/mountains.png");
		this.load.image("sky", "assets/sky.png");
		this.load.image("hill", "assets/chanter-hill.gif");
	},
	create: function(){
		var w = this.scale.width;
		var h = this.scale.height;

		this.add.sprite(0, 0, "sky");
		this.mountains = this.add.tileSprite(0, h - this.cache.getImage("mountains").height, w, h, "mountains");
		var hill = this.add.sprite(150 - this.cache.getImage("hill").width / 3, h - this.cache.getImage("hill").height * 3/5, "hill");
		hill.scale.set(0.7, 0.7);

		var root = this.dispRoot = this.add.sprite(w / 2, h / 2, "root");
		this.ground = this.make.tileSprite(-w * 2, 0, w * 4, h, "ground");
		root.addChild(this.ground);
		root.rotation = -0.45;

		this.input.onDown.add(function(){
			root.rotation -= 0.05;
		}, this);
	},
	update: function(){
		this.ground.tilePosition.x += this.speed;
		this.mountains.tilePosition.x += this.speed / 200;
	},
	render: function(){
		this.game.debug.text(this.dispRoot.rotation, 10, 20, "#000");
	},
	shutdown: function(){
	}
}
