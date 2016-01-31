Worshipper = function(game, x, y){
	// InputTime MUST be shorter than showingTime!
	Phaser.Sprite.call(this, game, x, y, 'followers');
    this.anchor.setTo(0.5, 1);
    this.speed = this.game.rnd.integerInRange(5,15)
    this.scale.setTo(0.5, 0.5);
    this.animations.add('idle', [0,1,2,3,4,5,6,7], this.speed, true);
    this.animations.add('leave', [8,9,10,11,12,13,14,15], this.speed, true);
    this.animations.add('sacrifice', [16,17,18,19,20,21,22,23], this.speed, true);
    this.animations.play('idle');
    
    this.onSuccessfulChant = new Phaser.Signal();
    this.onFailedChant = new Phaser.Signal();
    
    this.moveConst = 1;
    
    this.scream = this.game.add.audio('scream');

//    this.moveTimer = this.game.time.create(false);
//    this.delayStart = moveTimer;
    this.state = "idle";
    /*
    LIST OF STATES
    idle: standing in the crowd
    leave: leaving (lost follower)
    run: walking toward the volcano
    climb: walking up the volcano
    jump: jumping at the top of the volcano
    fall: falling into the volcano
    stop: off-stage, no animation
    */
};

Worshipper.prototype = Object.create(Phaser.Sprite.prototype);
Worshipper.prototype.constructor = Worshipper;

Worshipper.prototype.sacrifice = function(){
    this.state = "run";
    this.animations.play('sacrifice');
}

Worshipper.prototype.leave = function(){
    this.state = "leave";
    this.animations.play('leave');
    this.scale.x *= -1;
}

Worshipper.prototype.stop = function(){
    this.state = "stop";
    this.animations.stop();
}

Worshipper.prototype.update = function(){
	Phaser.Sprite.prototype.update.call(this);
	switch(this.state) {
        case "leave":
            this.x += this.moveConst;
            if (this.x - 24 > 800){
                this.stop();
            }
            break;
        case "run":
            this.x -= 2 * this.moveConst;
            if (this.y > 97 * this.x / 36 - 478){ // arrived at vo
                this.state = "climb";
            }
            break;
        case "climb":
            this.x -= 2 * this.moveConst * (36 / Math.sqrt(Math.pow(36, 2) + Math.pow(97, 2)));
            this.y -= 2 * this.moveConst * (97 / Math.sqrt(Math.pow(36, 2) + Math.pow(97, 2)));
            if (this.y < 117){
                this.state = "jump";
            }
            break;
        case "jump":
            this.y -= 5 * this.moveConst;
            if (this.y <= this.height){
                this.state = "fall";
                this.sendToBack();
                this.game.bg.sendToBack();
               // this.scream.play();
            }
            break;
        case "fall":
            this.y += 5 * this.moveConst;
            if (this.y > 350){
                this.state = "stop";
            }
            break;
    }
};