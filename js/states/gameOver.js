CustomEmitter = function(game, x, y, maxParticles){
	// InputTime MUST be shorter than showingTime!
	Phaser.Particles.Arcade.Emitter.call(this, game, x, y, maxParticles);
	this.totalEmitted = 0;
};

CustomEmitter.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
CustomEmitter.prototype.constructor = CustomEmitter;

CustomEmitter.prototype.emitParticle = function(){
	var emitted = Phaser.Particles.Arcade.Emitter.prototype.emitParticle.call(this);
	if(emitted)
		this.totalEmitted++;
	return emitted;
};

Phaser.GameObjectFactory.prototype.ggEmitter = function(x, y, maxParticles){
	return this.game.particles.add(new CustomEmitter(this.game, x, y, maxParticles));
};

var GameOver = function(game){
};
 
GameOver.prototype = {
	/* State methods */
	init: function(gameOverCondition){
		this.gameOverCondition = gameOverCondition;
	},
	preload: function(){
	},
	create: function(){
		this.bg = this.game.add.sprite(0, 0, 'night_bg');
		this.performance = "";
		// Show text depending on how the player did
		if(this.game.gameManager.totalFollowers <= 50)
			this.performance = "Consider retiring!";
		else if(this.game.gameManager.totalFollowers <= 100)
			this.performance = "Not such a great job!";
		else if(this.game.gameManager.totalFollowers <= 150)
			this.performance = "Good job!";
		else if(this.game.gameManager.totalFollowers <= 200)
			this.performance = "Great job!";
		else if(this.game.gameManager.totalFollowers <= 250)
			this.performance = "Incredible!";
		else
			this.performance = "Are you the pope?! Miraculous job!";

		var gameOverConditionText = this.game.add.text(this.game.world.centerX, 20, this.gameOverCondition, {fontSize: 22, fill: "#FFFFFF"});
		gameOverConditionText.anchor.setTo(0.5, 0.5);
		var gameOverTimer = this.game.time.create(true);
		gameOverTimer.add(Phaser.Timer.SECOND * 2, this.showPerformancePrompt, this);
		gameOverTimer.start();

		this.worshipperText = this.game.add.text(this.game.world.centerX / 2, 140, this.game.gameManager.totalFollowers + " True worshippers", {fontSize: 16, fill: "#FFFFFF"});
		this.worshipperText.anchor.setTo(0.5, 0.5);
		this.worshipperText.visible = false;
		this.defectorText = this.game.add.text(this.game.world.centerX + (this.game.world.centerX / 2), 140, this.game.gameManager.totalDefectors + " Disbelievers", {fontSize: 16, fill: "#FFFFFF"});
		this.defectorText.anchor.setTo(0.5, 0.5);
		this.defectorText.visible = false;

		this.scaleXPos = this.game.world.centerX;
		this.scaleYPos = this.game.world.centerY + 200;
		this.beamRotationFactor = 50;
		this.rotSpeed = 200;
		this.rotAngle = 0;
		this.beamAngle = 30;
		this.rotateScale = false;
		this.stepsRemaining = 0;

		this.scaleGroup = this.game.add.group();
		this.scaleGroup.enableBody = true;
		this.scaleGroup.y = 600;
		this.fulcrum = this.scaleGroup.create(this.scaleXPos, this.scaleYPos, 'scale_fulcrum');
		this.fulcrum.anchor.setTo(0.5, 0.5);
		this.beam = this.scaleGroup.create(this.scaleXPos, this.scaleYPos + (-this.fulcrum.height / 2), 'scale_beam');
		this.beam.anchor.setTo(0.5, 0.5);

		// The platforms will follow the two points on the beam group
		this.leftPlatform = this.scaleGroup.create((this.beam.x - this.rotSpeed) + 6, this.beam.y - 3, 'scale_platform');
		this.leftPlatform.anchor.setTo(0.5, 0.5);
	    this.game.physics.arcade.enable(this.leftPlatform);
	    this.leftPlatform.body.immovable = true;
	    this.leftPlatform.body.setSize(192, 6, 0, 0);
	   	this.leftPlatform.body.reset(this.leftPlatform.x, this.leftPlatform.y);

		this.rightPlatform = this.scaleGroup.create((this.beam.x + this.rotSpeed) - 8, this.beam.y - 3, 'scale_platform');
	    this.game.physics.arcade.enable(this.rightPlatform);
		this.rightPlatform.anchor.setTo(0.5, 0.5);
	    this.rightPlatform.body.immovable = true;
	    this.rightPlatform.body.setSize(192, 6, 0, 0);
	   	this.rightPlatform.body.reset(this.rightPlatform.x, this.rightPlatform.y);

		this.hideScale();

		// Create all the worshipper and defector sprites to throw on the scales
		// Use emitters to spawn them in over time, and the collison detection will still work!
		// Worshippers
	    this.worshipperEmitter = this.game.add.ggEmitter(this.game.world.centerX / 2, -50, this.game.gameManager.totalFollowers);
	    this.worshipperEmitter.makeParticles('true_worshipper');
		this.worshipperEmitter.minRotation = 0.5;
		this.worshipperEmitter.maxRotation = 0.5;
		this.worshipperEmitter.minParticleScale = 0.3;
		this.worshipperEmitter.maxParticleScale = 0.3;
	    this.worshipperEmitter.minParticleSpeed.setTo(-10, 10);
	    this.worshipperEmitter.maxParticleSpeed.setTo(10, 10);
	    this.worshipperEmitter.gravity = 150;
	    this.worshipperEmitter.bounce.setTo(0.2, 0.2);
	    //this.worshipperEmitter.angularDrag = 300;
	    this.worshipperEmitter.forEach(function(particle) {
	    	particle.body.setSize(25, 25, 0, 0);
	   		particle.body.reset(particle.x, particle.y);
	   		particle.body.friction.x = 0;
		});
		// Defectors
	    this.defectorEmitter = this.game.add.ggEmitter(this.game.world.centerX + (this.game.world.centerX / 2), -50, this.game.gameManager.totalDefectors);
	    this.defectorEmitter.makeParticles('defector');
		this.defectorEmitter.minRotation = 0.5;
		this.defectorEmitter.maxRotation = 0.5;
		this.defectorEmitter.minParticleScale = 0.3;
		this.defectorEmitter.maxParticleScale = 0.3;
	    this.defectorEmitter.minParticleSpeed.setTo(-10, 10);
	    this.defectorEmitter.maxParticleSpeed.setTo(10, 10);
	    this.defectorEmitter.gravity = 150;
	    this.defectorEmitter.bounce.setTo(0.2, 0.2);
	    //this.worshipperEmitter.angularDrag = 300;
	    this.defectorEmitter.forEach(function(particle) {
	    	particle.body.setSize(25, 25, 0, 0);
	   		particle.body.reset(particle.x, particle.y);
	   		particle.body.friction.x = 0;
   			particle.body.blocked.down = true;
		});

        this.gameOverMusic = this.game.add.audio('game_over', 1, true);
        this.gameOverMusic.play();
	},
	update: function(){
    	this.game.physics.arcade.collide([this.leftPlatform, this.rightPlatform], this.worshipperEmitter);
    	this.game.physics.arcade.collide([this.leftPlatform, this.rightPlatform], this.defectorEmitter);
    	this.leftPlatform.body.velocity.x = 0;
    	this.leftPlatform.body.velocity.y = 0;
    	this.rightPlatform.body.velocity.x = 0;
    	this.rightPlatform.body.velocity.y = 0;
		this.worshipperText.text = this.worshipperEmitter.totalEmitted + " True worshippers";
		this.defectorText.text = this.defectorEmitter.totalEmitted + " Disbelievers";
		if(!this.rotateScale)
			return;
		// Rotation will change based on the performance of the player
		var newAngle = this.beam.angle + (1 / this.beamRotationFactor);
		// If the difference remainiing to get to the angle is negative, stop
		if(this.beamAngle < 0)
		{
			if(newAngle - this.beamAngle < 0)
				return;
			this.beam.angle -= (1 / this.beamRotationFactor);
			this.rotAngle -= (1 / this.beamRotationFactor);
			// Move the platforms to the joints
			this.game.physics.arcade.velocityFromAngle(this.rotAngle - 270, this.rotSpeed / this.beamRotationFactor, this.leftPlatform.body.velocity);
			this.game.physics.arcade.velocityFromAngle(this.rotAngle + 90, -(this.rotSpeed / this.beamRotationFactor), this.rightPlatform.body.velocity);
		}
		else
		{
			if(this.beamAngle - newAngle < 0)
				return;
			this.beam.angle += (1 / this.beamRotationFactor);
			this.rotAngle += (1 / this.beamRotationFactor);
			// Move the platforms to the joints
			this.game.physics.arcade.velocityFromAngle(this.rotAngle + 270, this.rotSpeed / this.beamRotationFactor, this.leftPlatform.body.velocity);
			this.game.physics.arcade.velocityFromAngle(this.rotAngle - 90, -(this.rotSpeed / this.beamRotationFactor), this.rightPlatform.body.velocity);
		}
	},
	render: function(){
		//this.game.debug.body(this.leftPlatform, 'rgba(0, 255, 0, 1)', false);
		//this.game.debug.body(this.rightPlatform, 'rgba(0, 255, 0, 1)', false);
		/*
		this.leftPlatformGroup.forEach(function (tile) {
            tile.game.debug.body(tile, 'rgba(0, 255, 0, 1)', false);
        });
		this.rightPlatformGroup.forEach(function (tile) {
            tile.game.debug.body(tile, 'rgba(0, 255, 0, 1)', false);
        });
*/
	},
	shutdown: function(){
	},
	showPerformancePrompt: function(){
		var gameOverText = this.game.add.text(this.game.world.centerX, 60, "Your performance... ", {fontSize: 22, fill: "#FFFFFF"});
		gameOverText.anchor.setTo(0.5, 0.5);
		this.showScale();
	},
	showPerformance: function(){
		var performanceText = this.game.add.text(this.game.world.centerX, 100, this.performance, {fontSize: 22, fill: "#FFFFFF"});
		performanceText.anchor.setTo(0.5, 0.5);
        this.game.input.keyboard.start();
        var enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.addOnce(this.enterHandler, this);
	},
	moveScale: function(){
		this.rotateScale = true;
	},
	showScale: function(){
		this.scaleGroup.visible = true;
		var entranceTween = this.game.add.tween(this.scaleGroup).to({y:-25}, 1500, Phaser.Easing.Linear.None, true);
		entranceTween.onComplete.add(function() {
			var bounceTween = this.game.add.tween(this.scaleGroup).to({y:0}, 1000, Phaser.Easing.Bounce.Out, true, 0);
			bounceTween.onComplete.add(function(){
				this.worshipperText.visible = true;
				this.defectorText.visible = true;
				if(this.game.gameManager.totalFollowers > 0)
			    	this.worshipperEmitter.start(false, 0, 50);
				if(this.game.gameManager.totalDefectors > 0)
			    	this.defectorEmitter.start(false, 0, 50);
				// Set the beam anlge based on the performance
				this.beamAngle = (this.game.gameManager.totalDefectors - this.game.gameManager.totalFollowers) * (30 / (this.game.gameManager.totalDefectors + this.game.gameManager.totalFollowers));
				var moveScaleTimer = this.game.time.create(true);
				moveScaleTimer.add(Phaser.Timer.SECOND * 3, this.moveScale, this);
				moveScaleTimer.start();
				var gameOverTimer = this.game.time.create(true);
				gameOverTimer.add(Phaser.Timer.SECOND * 7, this.showPerformance, this);
				gameOverTimer.start();
			}, this);
		}, this);	
	},
	hideScale: function(){
		this.scaleGroup.visible = false;
	},
    enterHandler: function(){
        this.game.gameManager.reset();
        this.game.state.start("MainMenu");
    }
}