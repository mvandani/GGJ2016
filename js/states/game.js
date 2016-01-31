var GameState = function(game){
	this.numRunners = 5;
	this.runners = [];
	this.runningSpeed = 300;
	this.hitButtonOn = false;

	this.dispRoot = null; // group of everything moving...
	this.mountain = null;
	this.grounds = [];
	//Which index is on the left of screen currently.
	this.offGround;
	this.groundOffsetY = -100;

	this.score = 0;
	this.speedScoreFactor = 0.02;
	this.MAX_SPEED = 800;
};

GameState.prototype = {
	/* State methods */
	init: function(params){
	},
	preload: function(){
	},
	create: function(){
		var game = this.game;
		var w = this.scale.width;
		var h = this.scale.height;

		// Scenery
		this.sky = this.add.tileSprite(0, 0, w, this.cache.getImage("sky").height, "sky");
		this.mountain = this.add.tileSprite(0, h - this.cache.getImage("mountains").height -100, w, h, "mountains");
		var hill = this.add.sprite(150 - this.cache.getImage("hill").width / 3, h - this.cache.getImage("hill").height + 50, "hill");
		hill.scale.set(0.7, 0.7);

		// Priests
		var priests = this.make.sprite(250, 10, "priests");
		priests.animations.add("chant", [0, 1]);
		priests.animations.play("chant", 4, true);
		priests.scale.set(0.8, 0.8);
		hill.addChild(priests);

		// Display root, ground
		var root = this.dispRoot = this.add.sprite(w - 150, h * (3/8), "root-x");
		root.rotation = -0.45;
		this.createGround();
		this.input.onDown.add(function(){
			//root.rotation -= 0.05;
			this.runningSpeed = Math.min(this.runningSpeed + 50, this.MAX_SPEED);
		}, this);

		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Player
		this.player = new Player(game, 0, 0);
		this.player.create();
		this.player.angle = 30;
		root.addChild(this.player);

		//add runner (just test code)
		for (var i = 0; i < this.numRunners; i++) {
			var r = new Runner(game, -900, 0);
			r.create();
			this.runners.push(r);
		}

		//Temporary hit button (to evade)
		this.hitButton = new Phaser.Sprite(game, 0,0, 'root');
		this.evadeKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.evadeKey.onDown.add(this.tryEvade, this);

		this.newRunnerTimer();
		this.evadeSignal = new Phaser.Signal();
	},

	createGround: function() {
		var game = this.game;
		var w = this.scale.width;
		var h = this.scale.height;

		var ground0 = this.add.tileSprite(-w, this.groundOffsetY , w*3, h, "ground");
		game.physics.arcade.enable(ground0);
		var ground1 = this.add.tileSprite(-w*3, this.groundOffsetY , w*3, h, "ground");
		game.physics.arcade.enable(ground1);

		this.offGround = 1;

		this.grounds.push(ground0);
		this.grounds.push(ground1);
		this.dispRoot.addChild(ground0);
		this.dispRoot.addChild(ground1);
	},
	newRunnerTimer: function() {
		var game = this.game;
		var min = (this.runningSpeed >= 600)? 0.5 : 1;
		var max = (this.runningSpeed >= 600)? 3 : 4;
		var numSec = game.rnd.integerInRange(1,max);
		game.time.events.add(Phaser.Timer.SECOND * numSec, this.addRunner, this);
	},
	update: function(){
		var game = this.game;
		this.mountain.tilePosition.x += 0.005;
		this.sky.tilePosition.x += 0.25;
		for (var i = 0; i < this.grounds.length; i++) {
			this.grounds[i].body.velocity.x = this.runningSpeed;
		}
		this.player.update(this.runningSpeed);
		//update runner(s) that are on screen
		for (var i = 0; i < this.runners.length; i++) {
			var runner = this.runners[i];
			runner.update(this.runningSpeed, this.player);
			if (!runner.running) {
				continue;
			}
			if (runner.approached()) {
				this.showHitButton();
			}
			if (runner.isHit()) {
				this.attachRunnerToPlayer(runner);
			}
		}

		//If the left ground's 0,0 is at the root's 0,0 we swap the grounds
		if ((this.grounds[this.offGround].x + (this.scale.width)) >= -2) {
			this.swapGround();
		}
		this.score += Math.floor(this.runningSpeed * this.speedScoreFactor);
	},
	swapGround: function() {
		var w = this.scale.width;
		var h = this.scale.height;
		if (this.offGround == 0) {
			this.offGround = 1;
			this.grounds[1].reset(-w*3, this.groundOffsetY);
		} else {
			this.offGround = 0;
			this.grounds[0].reset(-w*3, this.groundOffsetY);
		}
	},
	addRunner: function() {
		for (var i = 0; i < this.runners.length; i++) {
			var r = this.runners[i];
			if (!r.running) {
				r.revive();
				this.dispRoot.addChild(r);
				break;
			}
		}
		this.newRunnerTimer();
	},
	tryEvade:function() {
		this.player.punch();
		if (this.hitButtonOn) {
			//Stop runners that are close
			for (var i = 0; i < this.runners.length; i++) {
				var runner = this.runners[i];
				if (runner.isClose()) {
					runner.evade();
					this.hitButton.kill();
					this.hitButtonOn = false;
					this.evadeSignal.dispatch("close");
				}
			}
		}
	},
	showHitButton: function() {
		var game = this.game;
		this.hitButton.reset(0,0);
		game.add.existing(this.hitButton);
		this.hitButtonOn = true;
		this.evadeSignal.dispatch("open");
	},
	attachRunnerToPlayer: function(runner) {
		var game = this.game;
		this.player.kill();
		runner.kill();
	},
	render: function(){
		this.game.debug.text(this.score, 10, 20, "#000");
		//this.game.debug.geom(this.player.getBounds());
			for (var i = 0; i < this.runners.length; i++) {
				var runner = this.runners[i];
				//this.game.debug.geom(runner.getBounds());
			}
	},
	shutdown: function(){
	}
}