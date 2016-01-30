var Timing = function(game){
	this.cursors;
	
	this.speed;
	this.text;
	
	this.bar;
	
	this.stepLength;
	this.stepGrace;
	this.stepTimer;
	
	this.keyHit;
	this.lastKey;
	
};
 
Timing.prototype = {
	
	init: function(params){
		this.speed = 50;
		
		this.stepLength = 1000;
		this.stepGrace= 500;
	},
	
	preload: function(){
	},
	
	create: function(){
		this.cursors = this.game.input.keyboard.createCursorKeys();
	   
		this.cursors.left.onDown.add(this.step, this);
		this.cursors.right.onDown.add(this.step, this);
		
		
		//TIMER
		this.stepTimer = this.game.time.create(false);
		this.stepTimer.loop(this.stepLength, this.endTimer, this);
		
		//TEXT
		var style = { font: "19px Arial", fill: "#BB9900", align: "center" };
		this.text = this.game.add.text(5,0, "", style);
		this.text.addColor("#FFFFFF", 3);
		
		this.bar = this.game.add.text(5,25, "", style);
		
		this.stepTimer.start();
		this.key = this.cursors.left;
	},
	
	
	update: function(){       
		this.updateText();
	},
	
	updateText: function(){
		this.text.text = "" + this.speed + " woodles per bamboodle!";
		this.bar.clearColors();
		var s = Math.floor((this.stepTimer.ms/(this.stepLength)) * 10);
		
		var color = "#FF3300";
		if(this.stepTimer.ms > this.stepLength - this.stepGrace)
			color = "#77cc33";
		
		this.bar.addColor(color,0);
		this.bar.addColor("#FFFFFF",s);
		this.bar.text = "0000000000   " + s + "  " + this._keyToHit;
	},
	
	
	failStep: function(){
		this.speed -= 1;
		this.text.addColor("#FF3300", 0);
		this.text.addColor("#FFFFFF", 3);
	},
		
	winStep: function(){
		this.speed += 1;
		this.text.addColor("#77cc33", 0);
		this.text.addColor("#FFFFFF", 3);
	},
	
	
	step: function(e){
		var key = e.keyCode;
		var ms = this.stepTimer.ms;
		var failed = false;
		
		//hit same key or too early
		if(key == this.lastKey || ms < this.stepLength - this.stepGrace){
			this.failStep();
			failed = true;
		}
		else{
			this.winStep();
		}
		
		this._keyToHit = this.lastKey;
		this.keyHit = true;
		
		this.lastKey = null;
		if(!failed)
			this.lastKey = key;
	},
	
	endTimer: function(){
		if(!this.keyHit){
			this.failStep();
		}
		this.keyHit = false;
		this.stepTimer.stop(false);
		this.stepTimer.start();
	}
}