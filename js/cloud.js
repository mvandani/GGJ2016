Cloud = function(game, x, y, direction){
    if (x == 0 && y == 0){
        x = direction > 0 ? -70 : 870;
        y = game.rnd.integerInRange(0, 120);
    }
	Phaser.Sprite.call(this, game, x, y, 'cloud' + String(game.rnd.integerInRange(1, 3)));
    this.direction = direction;
    this.anchor.setTo(0.5, 0.5);
    this.speed = this.game.rnd.integerInRange(8, 12);
//    this.scale.setTo(0.5, 0.5);
};

Cloud.prototype = Object.create(Phaser.Sprite.prototype);
Cloud.prototype.constructor = Cloud;

Cloud.prototype.update = function(){
	Phaser.Sprite.prototype.update.call(this);
    this.x += this.direction * this.speed / 10;
};