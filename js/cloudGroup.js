CloudGroup = function(game){
	Phaser.Group.call(this, game);
    this.direction = this.game.rnd.integerInRange(0,1) == 0 ? -1 : 1;
    for (i = 0; i < this.game.rnd.integerInRange(0,4); i++){
	   this.add(new Cloud(game, this.game.rnd.integerInRange(0,800), this.game.rnd.integerInRange(0, 120), this.direction));
    }
    this.addCloudTimer = this.game.time.create(false);
    this.addCloudTimer.loop(Phaser.Timer.SECOND / 2, this.addCloud, this);
    this.addCloudTimer.start();
}

CloudGroup.prototype = Object.create(Phaser.Group.prototype);
CloudGroup.prototype.constructor = CloudGroup;

CloudGroup.prototype.update = function(){
	Phaser.Group.prototype.update.call(this);
    this.forEach(function(cloud){
		if ((this.direction < 0 && cloud.x + cloud.width / 2 < 0) || 
            (this.direction > 0 && cloud.x - cloud.width / 2 > 800)){
            this.remove(cloud);
        }
	}, this, false, event);
};

CloudGroup.prototype.addCloud = function(){
    var rnd = this.game.rnd.integerInRange(0,6);
    if (rnd < 1){
        this.add(new Cloud(this.game, 0, 0, this.direction));
    }
}