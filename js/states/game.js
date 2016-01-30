var GameState = function(game){
	this.numRunners = 5;
	//Tells which runners are on screen
	this.runnerMap = {}; 
	this.runners = [];
	this.runningSpeed = 200;
	this.hitButtonOn = false;
	//this.speed = 5;

	this.dispRoot = null; // group of everything moving...
	this.mountain = null;
	this.grounds = [];
	//Which index is on the left of screen currently.
	this.offGround;
	this.groundOffsetY = -100;
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
		/*background and foreground set up*/
		this.add.sprite(0, 0, "sky");
		this.mountains = this.add.tileSprite(0, h - this.cache.getImage("mountains").height, w, h, "mountains");
		var hill = this.add.sprite(150 - this.cache.getImage("hill").width / 3, h - this.cache.getImage("hill").height * 3/5, "hill");
		hill.scale.set(0.7, 0.7);

		var root = this.dispRoot = this.add.sprite(w - 150, h * (3/8), "root");
		root.rotation = -0.45;
		this.createGround();
		this.input.onDown.add(function(){
			root.rotation -= 0.05;
			this.runningSpeed += 35;
		}, this);

		game.physics.startSystem(Phaser.Physics.ARCADE);
		/*Player and runner set up*/
		this.player = new Player(game, 0, 0);
		//Add player
		game.physics.arcade.enable(this.player);
		root.addChild(this.player);
		//add runner (just test code)
		for (var i = 0; i < this.numRunners; i++) {
			this.runners.push(new Runner(game));
			this.runners[i].create();
			this.runnerMap[i] = false;
		}
		//Temporary hit button (to evade)
		this.hitButton = new Phaser.Sprite(game, 0,0, 'runner');
		this.evadeKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.evadeKey.onDown.add(this.tryEvade, this);

		this.newRunnerTimer();
	},
	createGround: function() {
		var game = this.game;
		var w = this.scale.width;
		var h = this.scale.height;
		var ground0 = this.add.tileSprite(-w, this.groundOffsetY , w*3, h, "ground");
		game.physics.arcade.enable(ground0);
		var ground1 = this.add.tileSprite(-w*3, this.groundOffsetY , w*3, h, "ground");
		game.physics.arcade.enable(ground0);
		game.physics.arcade.enable(ground1);
		this.offGround = 1;
		this.grounds.push(ground0);
		this.grounds.push(ground1);
		this.dispRoot.addChild(ground0);
		this.dispRoot.addChild(ground1);
	},
	newRunnerTimer: function() {
		var game = this.game;
		var numSec = game.rnd.integerInRange(1,4);
		game.time.events.add(Phaser.Timer.SECOND * numSec, this.addRunner, this);
	},
	update: function(){
		var game = this.game;
		this.mountains.tilePosition.x += this.speed / 200;
		for (var i = 0; i < this.grounds.length; i++) {
			this.grounds[i].body.velocity.x = this.runningSpeed;	
		}
		this.player.update();
		//update runner(s) that are on screen
		for (var i = 0; i < this.runners.length; i++) {
			if (!this.runnerMap[i]) {
				continue;
			}
			var runner = this.runners[i];
			runner.update(this.runningSpeed, this.player);

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
 			if (this.runnerMap[i] == false) {
 				this.runners[i].addToGame(this.dispRoot);
 				this.runnerMap[i] = true;
 				break;
 			}
		}
		this.newRunnerTimer();
	},
	tryEvade:function() {
		if (this.hitButtonOn) {
			//Stop runners that are close
			for (var i = 0; i < this.runners.length; i++) {
				var runner = this.runners[i];
				if (runner.isClose()) {
					runner.evade();
					this.runnerMap[i] = false;
					this.hitButton.kill();
					this.hitButtonOn = false;
				}
			}
		}
	},
	showHitButton: function() {
		var game = this.game;
		this.hitButton.reset(0,0);
		game.add.existing(this.hitButton);
		this.hitButtonOn = true;

	},
	attachRunnerToPlayer: function(runner) {
		var game = this.game;
		this.player.kill();
	},
	render: function(){
		this.game.debug.text(this.dispRoot.rotation, 10, 20, "#000");
	},
	shutdown: function(){
	}
}