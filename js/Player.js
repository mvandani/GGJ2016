var Player = function (game, x, y) {
	this.game = game;
	this.spriteW = 174;
	this.spriteH = 234;
	Phaser.Sprite.call(this, game, x - this.spriteW / 2, y - this.spriteH / 2, 'player');
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.create = function(){
	var game = this.game;
	var runAnim = this.run = this.animations.add('run', [0,1,2,3,4,5,6,7]);
	var punchAnim = this.animations.add('punch', [8,9]);
	punchAnim.onComplete.add(function(){
		runAnim.play();
	});

	this.animations.play('run', 13, true);
	game.physics.arcade.enable(this);
	this.body.setSize(170, 200, 0, 0);
};

Player.prototype.update = function(runSpeed){
	this.run.speed = runSpeedToFps(runSpeed);
};

Player.prototype.punch = function() {
	this.animations.play('punch', 12, false);
};

var runSpeedToFps = function (runSpeed) {
	return Math.min(25, 10 + Math.floor(runSpeed/40));
};
