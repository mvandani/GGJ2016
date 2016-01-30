var Player = function (game, x, y) {
	this.game = game;
	Phaser.Sprite.call(this, game, -game.cache.getImage("player").width / 2, -game.cache.getImage("player").height / 2, 'player');
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.create = function(){};
Player.prototype.update = function(){};