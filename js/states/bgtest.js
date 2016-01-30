var BGTestState = function(game){
	this.speed = 20;

	this.dispRoot = null; // group of everything moving...
	this.ground = null;
};
 
BGTestState.prototype = {
	init: function(params){
		//this.stage.disableVisibilityChange = false; // no outside pause
	},
	preload: function(){
		this.load.image("ground", "assets/ground.png");
		this.load.image("root", "assets/root-x.png");
	},
	create: function(){
		var w = this.scale.width;
		var h = this.scale.height;
		var m = this.dispRoot = this.add.sprite(w / 2, h / 2, "root");

		this.ground = this.make.tileSprite(-w * 2, 0, w * 4, h, "ground");
		m.addChild(this.ground);

		this.input.onDown.add(function(){
			m.rotation -= 0.05;
		}, this);
	},
	update: function(){
		this.ground.tilePosition.x += this.speed;
	},
	render: function(){
		this.game.debug.text(this.dispRoot.rotation, 10, 20);
	},
	shutdown: function(){
	}
}
