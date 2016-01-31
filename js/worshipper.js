Worshipper = function(game, x, y){
	Phaser.Sprite.call(this, game, 500 + x, y, 'followers');
    this.startX = x;
    this.anchor.setTo(0.5, 1);
    this.speed = this.game.rnd.integerInRange(8,12);
    this.scale.setTo(0.5, 0.5);
    this.animations.add('idle', [0,1,2,3,4,5,6,7], this.speed, true);
    this.animations.add('leave', [8,9,10,11,12,13,14,15], this.speed * 2, true);
    this.animations.add('sacrifice', [16,17,18,19,20,21,22,23], this.speed, true);
    this.animations.add('blast', [24,25,26,27,28,29,30,31], this.speed, true);
    this.animations.play('sacrifice');
    
    this.onSuccessfulChant = new Phaser.Signal();
    this.onFailedChant = new Phaser.Signal();
    
    this.moveConst = this.speed / 10;
    
    var noises = [
                    this.game.add.audio('scream'),
                    this.game.add.audio('explosion'),
                    this.game.add.audio('level_up'),
                    this.game.add.audio('level_down'),
                  ];
    this.noise = noises[this.game.rnd.integerInRange(0,3)];
    this.blastDelay = this.game.time.create(false);
    this.noiseTimer = this.game.time.create(false);
    this.noiseTimer.loop(Phaser.Timer.SECOND * 1, this.enableNoise, this);
    
    this.state = "enter";
    this.blast();
    /*
    LIST OF STATES
    enter: entering stage
    idle: standing in the crowd
    leave: leaving (lost follower)
    run: walking toward the volcano
    climb: walking up the volcano
    jump: jumping at the top of the volcano
    fall: falling into the volcano
    stop: off-stage, no animation
    readyToBlast: off-stage, no animation
    blast: shoot out of the volcano
    */
};

Worshipper.prototype = Object.create(Phaser.Sprite.prototype);
Worshipper.prototype.constructor = Worshipper;

Worshipper.prototype.enableNoise = function(){
    this.game.followerNoiseEnabled = true;
    this.noiseTimer.stop();
}

Worshipper.prototype.blast = function(){
    this.blastDelay.add(this.game.rnd.integerInRange(0,3000), this.actuallyBlast, this);
    this.blastDelay.start();
}

Worshipper.prototype.actuallyBlast = function(){
    if (this.state == "readyToBlast"){
        this.x = 220;
        this.y = 120;
        this.angle = this.game.rnd.integerInRange(-16,16);
        this.state = "blast"
        this.animations.play('blast');
    }
}

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
    if (this.state != "readyToBlast" && this.state != "leave"){
        this.state = "stop";
        this.animations.stop();
    }
}

Worshipper.prototype.update = function(){
	Phaser.Sprite.prototype.update.call(this);
	switch(this.state) {
        case "enter":
            this.x -= 4 * this.moveConst;
            if (this.x < this.startX){
                this.state = "idle";
                this.animations.play('idle');
            }
            break;
        case "leave":
            this.x += this.moveConst;
            if (this.x - 24 > 800){
                this.state = "idle";
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
                this.game.world.sendToBack(this.game.clouds);
                this.game.bg.sendToBack();
                if (this.game.followerNoiseEnabled){
                    this.noise.play();
                    this.game.followerNoiseEnabled = false;
                    this.noiseTimer.start();
                }
            }
            break;
        case "fall":
            this.y += 5 * this.moveConst;
            if (this.y > 350){
                this.state = "readyToBlast";
            }
            break;
        case "blast":
            this.y -= 2 * Math.cos(this.angle * Math.PI / 180);
            this.x -= 2 * Math.sin(this.angle * Math.PI / 180);
            if (this.y < -100){
                this.state = "stop";
            }
            break;
    }
};