var Runner = function(game) {
	this.game = game;
	this.startX = -900;
	Phaser.Sprite.call(this, game, this.startX, -game.cache.getImage("runner").height / 2, 'runner');
	this.closeToPlayer = false;
	this.hitPlayer = false;
	this.wasClose = false;
	this.destroyed = false;
	this.invisBox = new Phaser.Sprite(game, this.startX, -game.cache.getImage("runner").height / 2, "");
};

Runner.prototype = Object.create(Phaser.Sprite.prototype);
Runner.prototype.constructor = Runner;
Runner.prototype.create = function(){
	var game = this.game;
	this.addChild(this.invisBox);
	game.physics.arcade.enable(this);
	this.body.setSize(this.width-20, this.height, 0, 0);
	this.invisBox.body.setSize(this.width+60, this.height, 0, 0);
}

Runner.prototype.addToGame = function(dispRoot) {
	var game = this.game;
	this.revive();
	dispRoot.addChild(this);
}
Runner.prototype.update = function(runSpeed, player){
	var game = this.game;
	if (!this.destroyed && !this.hitPlayer) {
		this.body.velocity.x = runSpeed;
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
		this.kill();
		this.invisBox.kill();
		this.destroyed = true;
}

Runner.prototype.revive = function() {
	var game = this.game;
	this.closeToPlayer = false;
	this.hitPlayer = false;
	this.wasClose = false;
	this.destroyed = false;
	this.reset(this.startX, -game.cache.getImage("runner").height / 2);
	this.invisBox.reset(this.startX, -game.cache.getImage("runner").height / 2);
}
