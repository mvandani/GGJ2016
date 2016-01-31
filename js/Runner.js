var Runner = function(game, x, y) {
	this.game = game;
	this.spriteW = 174;
	this.spriteH = 234;
	this.startX = x - this.spriteW / 2;
	this.startY = y - this.spriteH / 2;

	this.running = false;
	this.closeToPlayer = false;
	this.hitPlayer = false;
	this.wasClose = false;

	this.invisBox = null;

	this.hitSounds = [this.game.add.audio('flying0'),
			this.game.add.audio('flying1'),
			this.game.add.audio('flying2'),
			// this.game.add.audio('flying3'),
			// this.game.add.audio('flying4'),
			this.game.add.audio('hit0'),
			this.game.add.audio('hit1'),
			this.game.add.audio('hit2'),
			this.game.add.audio('hit3'),
			this.game.add.audio('hit4')];

	Phaser.Sprite.call(this, game, this.startX, this.startY, 'runner');
};

Runner.prototype = Object.create(Phaser.Sprite.prototype);
Runner.prototype.constructor = Runner;
Runner.prototype.create = function(){
	var game = this.game;

	// Second hitbox
	this.invisBox = new Phaser.Sprite(game, this.startX, this.startY, "");
	this.addChild(this.invisBox);

	// Laws of nonsense
	game.physics.arcade.enable(this);
	this.body.setSize(this.width-35, this.height, 0, 0);
	this.invisBox.body.setSize(this.width+60, this.height, 0, 0);

	this.animations.add('run', [0,1]);
	this.animations.add('die', [2,2]);
}

Runner.prototype.revive = function(){
	this.running = true;
	this.closeToPlayer = false;
	this.hitPlayer = false;
	this.wasClose = false;

	this.reset(this.startX, this.startY);
	this.invisBox.reset(this.startX, this.startY);
	this.animations.play('run', 6, true);
}

Runner.prototype.update = function(runSpeed, player){
	var game = this.game;
	if (!this.exists) {
		return;
	}

	if (!this.hitPlayer) {
		this.body.velocity.x = runSpeed + 50;
		//Readjust buffer based on speed.
		var buffer = 40 + Math.min(40, Math.floor(runSpeed / 15));
		this.invisBox.body.setSize(this.width+buffer, this.height, 0, 0);
		//Keep larger hitbox attached to runner.
		this.invisBox.body.x = this.body.x;
		this.invisBox.body.y = this.body.y;
		if (!this.closeToPlayer) {
			game.physics.arcade.overlap(this.invisBox, player, this.gotClose, null, this);
		} else {
			game.physics.arcade.overlap(this, player, function(){
				this.body.velocity.x = 0;
				this.hitPlayer = true;
			}, null, this);
		}
	}
}

Runner.prototype.gotClose = function() {
	this.closeToPlayer = true;
}

Runner.prototype.approached = function() {
	if (!this.wasClose && this.closeToPlayer) {
		this.wasClose = true;
		return true;
	}
	return false;
}

Runner.prototype.isClose = function() {
	return this.closeToPlayer;
}

Runner.prototype.isHit = function() {
	return this.hitPlayer;
}

Runner.prototype.evade = function() {
	this.running = false;
	this.animations.play('die', 8, false, true);
}

Runner.prototype.playDeathAudio = function(){
	this.hitSounds[Math.floor(Math.random() * this.hitSounds.length)].play();
}

Runner.prototype.kill = function() {
	Phaser.Sprite.prototype.kill.call(this);
	this.invisBox.kill();
}
