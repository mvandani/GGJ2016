WorshipperGroup = function(game){
	Phaser.Group.call(this, game);
	// Create a new Phaser.Sprite using...
	//this.create(x, y, 'key', frame);

	// Or a new custom sprite using...
	//this.add(new CustomSprite(game, x, y, 'key', frame));
}

WorshipperGroup.prototype = Object.create(Phaser.Group.prototype);
WorshipperGroup.prototype.constructor = WorshipperGroup;

WorshipperGroup.prototype.update = function(){
	Phaser.Group.prototype.update.call(this);
};