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
	this.MAX_SPEED = 1200;
	this.MIN_SPEED = 50;

	this.rhythmEngine = null;
	this.keyPair = null;
	this.keyPairText = null;

	this.bonusSounds = [];
	this.numKills = 0;
};

GameState.prototype = {
	/* State methods */
	init: function(params){
	},
	preload: function(){
	},
	create: function(){
		this.score = 0;
		this.speedScoreFactor = 0.02;

		var game = this.game;
		var w = this.scale.width;
		var h = this.scale.height;
		game.physics.startSystem(Phaser.Physics.ARCADE);

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

		// Player
		this.player = new Player(game, 0, 0);
		this.player.create();
		this.player.angle = 30;
		root.addChild(this.player);

		// Dead player
		var deadPlayerSize = {width: 317, height: 212};
		this.deadPlayer = this.add.sprite(-deadPlayerSize.width / 2, -deadPlayerSize.height / 2, "player-drag");
		this.deadPlayer.animations.add("run", [0, 1, 2, 1]);
		this.deadPlayer.animations.play("run", 4, true);
		this.deadPlayer.visible = false;
		root.addChild(this.deadPlayer);

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

		//sounds
		this.bonusSounds = [this.game.add.audio('good0'),
			this.game.add.audio('good1'),
			this.game.add.audio('good2'),
			this.game.add.audio('good3'),
			this.game.add.audio('good4'),
			this.game.add.audio('good5'),
			this.game.add.audio('good6'),
			this.game.add.audio('good7'),
			this.game.add.audio('good8'),
			this.game.add.audio('good9')];


		// Rhythm engine
		this.keyPairText = game.add.text(game.world.centerX, game.world.centerY - 200, "", {font: "200px Arial"});
		this.keyPairText.anchor.setTo(0.5,0.5);
		var keyPairs = [
			[game.input.keyboard.addKey(Phaser.Keyboard.W), game.input.keyboard.addKey(Phaser.Keyboard.E)],
			[game.input.keyboard.addKey(Phaser.Keyboard.C), game.input.keyboard.addKey(Phaser.Keyboard.P)],
			[game.input.keyboard.addKey(Phaser.Keyboard.T), game.input.keyboard.addKey(Phaser.Keyboard.B)],
			[game.input.keyboard.addKey(Phaser.Keyboard.K), game.input.keyboard.addKey(Phaser.Keyboard.R)],
		];
		this.rhythmEngine = new RhythmEngine(game.time.create(false), 500, keyPairs);
		this.rhythmEngine.onHit.add(this.onRhythmHit, this);
		this.rhythmEngine.onMiss.add(this.onRhythmMiss, this);
		this.rhythmEngine.onDegrade.add(this.onRhythmDegrade, this);
		this.keyPair = this.rhythmEngine.getPair();
		this.keyPairText.text = String.fromCharCode(this.keyPair[0].keyCode) + "  " + String.fromCharCode(this.keyPair[1].keyCode);
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
			var body = this.grounds[i].body;
			if (body == null) {
				continue;
			}
			body.velocity.x = this.runningSpeed;
		}
		this.player.update(this.runningSpeed);
		//update runner(s) that are on screen
		for (var i = 0; i < this.runners.length; i++) {
			var runner = this.runners[i];
			runner.update(this.runningSpeed, this.player);
			if (!runner.exists || !runner.running) {
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
		if (!this.deadPlayer.visible) {
			this.score += Math.floor(this.runningSpeed * this.speedScoreFactor);
		}

		// Rhythm
		this.keyPair = this.rhythmEngine.getPair();
		this.keyPairText.text = String.fromCharCode(this.keyPair[0].keyCode) + "  " + String.fromCharCode(this.keyPair[1].keyCode);
	},
	swapGround: function() {
		var w = this.scale.width;
		var h = this.scale.height;
		if (this.offGround == 0) {
			this.offGround = 1;
		} else {
			this.offGround = 0;
		}
		var g = this.grounds[this.offGround];
		if (g.exists) {
			g.reset(-w*3, this.groundOffsetY);
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
					this.numKills+=1;
					if(this.numKills%5 == 0){
						this.bonusSounds[Math.floor(Math.random() * this.bonusSounds.length)].play();
					}else{
						runner.playDeathAudio();
					}
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
		this.player.kill();
		runner.kill();
		this.deadPlayer.visible = true;

		var stats = {
			score: this.score,
		};
		var timer = this.game.time.create(true);
		timer.add(3000, function(){
			this.game.state.start("Ending", true, false, stats);
		}, this);
		timer.start();
	},

	onRhythmHit: function(e){
		this.keyPairText.clearColors();
		this.keyPairText.addColor("#55AA11", e.i);
		if (e.i == 0) {
			this.keyPairText.addColor("#000000", 1);
		}
		this.runningSpeed = Math.min(this.runningSpeed + 15, this.MAX_SPEED);
	},

	onRhythmMiss: function(e){
		this.keyPairText.clearColors();
		this.keyPairText.addColor("#AA5500", e.i);
		if (e.i == 0) {
			this.keyPairText.addColor("#000000", 1);
		}
		this.runningSpeed = Math.max(this.runningSpeed - 15, this.MIN_SPEED);
	},

	onRhythmDegrade: function(e){
		this.runningSpeed = Math.max(this.runningSpeed - 15, this.MIN_SPEED);
	},

	render: function(){
		this.game.debug.text(this.score, 10, 20, "#000");
		if (this.keyPair) {
			var t = String.fromCharCode(this.keyPair[0].keyCode) + " " + String.fromCharCode(this.keyPair[1].keyCode);
			this.game.debug.text(t, 10, 40, "#000");
		}
		this.game.debug.text(this.numKills, 10 , 60, "#000");

		/*
		this.game.debug.geom(this.player.getBounds());
		for (var i = 0; i < this.runners.length; i++) {
			var runner = this.runners[i];
			this.game.debug.geom(runner.getBounds());
		}
		*/
	},
	shutdown: function(){
	}
}