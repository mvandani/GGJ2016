var Player = function (game, x, y) {
	this.game = game;
	this.spriteW = 174;
	this.spriteH = 234;
	Phaser.Sprite.call(this, game, -this.spriteW/ 2, -this.spriteH / 2, 'player');
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.create = function(){
	var game = this.game;
	this.run = this.animations.add('run');
	this.animations.play('run', 13, true);
	game.physics.arcade.enable(this);
	this.body.setSize(170, 200, 0, 0);

};
Player.prototype.update = function(runSpeed){
	this.run.speed = runSpeedToFps(runSpeed);
};

var runSpeedToFps = function (runSpeed) {
	return Math.min(25, 10 + Math.floor(runSpeed/40));
};