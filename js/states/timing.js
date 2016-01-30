var Timing = function(game){
	this.cursors;

	this.speed = 50;
	this.text;

	this.bar;

	this.rhythmEngine;
};

Timing.prototype = {

	init: function(params){
	},

	preload: function(){
	},

	create: function(){


		var stepTimer = this.game.time.create(false);
		this.rhythmEngine = new RhythmEngine(stepTimer, 10000, 2000);
		this.rhythmEngine.onHit.add(this.winStep, this);
		this.rhythmEngine.onMiss.add(this.failStep, this);


		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.cursors.left.onDown.add(this.rhythmEngine.step, this.rhythmEngine);
		this.cursors.right.onDown.add(this.rhythmEngine.step, this.rhythmEngine);

		//TEXT
		var style = { font: "19px Arial", fill: "#BB9900", align: "center" };
		this.text = this.game.add.text(5,0, "", style);
		this.text.addColor("#FFFFFF", 3);

		this.bar = this.game.add.text(5,25, "", style);
	},


	update: function(){
		this.text.text = "" + this.speed + " woodles per bamboodle!";
		this.bar.clearColors();
		var s = Math.floor((this.rhythmEngine.getMs()/this.rhythmEngine.timerLength) * 10) % 10;


		var delta = this.rhythmEngine.getDelta();

		var color = "#FF3300";
		if(Math.abs(delta) < this.rhythmEngine.grace)
			color = "#77cc33";

		this.bar.addColor(color,0);
		this.bar.addColor("#FFFFFF",s);
		this.bar.text = "0000000000   " + s + "  " + delta;
	},


	failStep: function(e){
		this.speed -= 1;
		this.text.addColor("#FF3300", 0);
		this.text.addColor("#FFFFFF", 3);
	},

	winStep: function(e){
		this.speed += 1;
		this.text.addColor("#77cc33", 0);
		this.text.addColor("#FFFFFF", 3);
	},
}