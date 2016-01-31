Priest = function(game, x, y, priestData){
	// InputTime MUST be shorter than showingTime!
	Phaser.Sprite.call(this, game, x, y, priestData.priest, 0);
	this.animations.add('idle', priestData.frames, priestData.fps, true);
	this.animations.play('idle');
	this.priestData = priestData;
	this.showingTime = priestData.shownTime;
	this.inputTime = priestData.inputTime;
	this.baseKeys = priestData.keys;
	this.followerCount = priestData.followerCount;
	this.icons = [];
	this.controlsShowing = false;
	this.iconSize = 24;
	this.track = priestData.track;
	this.levelsWhileAlive = 0;
	this.level = 0;
	this.keys = [];

    this.onSuccessfulInput = new Phaser.Signal();
    this.onSuccessfulChant = new Phaser.Signal();
    this.onFailedChant = new Phaser.Signal();

    this.levelUpPending = false;

	// Create all the icons and keys to use.
	// Text will be used for the characters.
	this.iconLookup = this.game.cache.getJSON('iconLookup');
	this.controlsBG = this.addChild(new Phaser.Graphics(this.game, (this.width / 2) - (this.iconSize / 2), -this.iconSize));
	this.updateDifficulty();

	// A single emitter that will exist in the game world so the particles will not be hidden when the input is hidden
	this.emitter = this.game.add.emitter(0, 0, 100);
	this.emitter.makeParticles('key_particle');
	this.emitter.gravity = 100;
	this.emitter.setXSpeed(-150, 150);
	this.emitter.setYSpeed(-150, 150);

    this.timesUpTimer = this.game.time.create(false);
    this.showControlsTimer = this.game.time.create(false);
    this.showControlsTimer.add(Phaser.Timer.SECOND * this.showingTime, this.showControls, this);
    this.showControlsTimer.start();
    this.track.volume = 1;
};

Priest.prototype = Object.create(Phaser.Sprite.prototype);
Priest.prototype.constructor = Priest;

Priest.prototype.enterScreen = function() {
	this.game.add.tween(this).to({y:0}, 250, Phaser.Easing.Back.Out, true, 0, 0, false);
};

Priest.prototype.levelUp = function(){
	if(this.controlsShowing)
	{
		this.levelUpPending = true;
		return;
	}
	this.levelUpPending = false;
	// Every two times a new priest is added and I am alive, I will level up!
	this.levelsWhileAlive++;
	if(this.levelsWhileAlive > 0 && this.levelsWhileAlive % 2 == 0)
		this.updateDifficulty();
};

Priest.prototype.updateDifficulty = function(){
	if(this.level + 1 > 3) // No more leveling up!
		return;
	this.level++;
	// Create a new set of keys based on the difficulty level
	var rndIndex = this.game.rnd.integerInRange(0, this.baseKeys.length - 1);
	this.keys.push(this.baseKeys[rndIndex]);
	this.updateIcons();
};

Priest.prototype.updateIcons = function(){
    var controlsWidth = this.keys.length * this.iconSize;
    this.controlsBG.clear();
    this.controlsBG.beginFill(0xFFFFFF);
    this.controlsBG.lineStyle(2, 0x000000, 1);
    // Draw left depending on the amount
    this.controlsBG.drawRoundedRect(-(this.iconSize / 2) * (this.keys.length - 1), 0, controlsWidth, this.iconSize, 4);
    // Callout
    this.controlsBG.moveTo(4, this.iconSize);
    this.controlsBG.lineTo(12, this.iconSize + 8);
    this.controlsBG.lineTo(20, this.iconSize);
    this.controlsBG.lineStyle(2, 0xFFFFFF, 1);
    this.controlsBG.moveTo(19, this.iconSize);
    this.controlsBG.lineTo(5, this.iconSize);
    this.controlsBG.endFill();
    this.controlsBG.visible = false;
    this.icons = [];
    this.controlsBG.removeChildren();
	var len = this.keys.length;
	for(var i = 0; i < len; i++)
	{
		var keyCode = this.keys[i];
		var icon = null;
		if(keyCode == Phaser.KeyCode.UP || keyCode == Phaser.KeyCode.DOWN || keyCode == Phaser.KeyCode.LEFT || keyCode == Phaser.KeyCode.RIGHT)
			icon = this.controlsBG.addChild(new Phaser.Sprite(this.game, 0, 0, this.iconLookup[keyCode], 0));
		else
			icon = this.controlsBG.addChild(new Phaser.Text(this.game, 0, 0, String.fromCharCode(keyCode), {font: 'Consolas', fontSize: 22, fontWeight: "bold", fill: "#000000"}));
		icon.keyCode = keyCode;
		this.icons.push(icon);
	}
};

Priest.prototype.update = function(){
	Phaser.Sprite.prototype.update.call(this);
	this.emitter.forEachAlive(function(p){
		p.alpha= p.lifespan / this.emitter.lifespan;
	}, this);
};

Priest.prototype.destroy = function(){
    this.track.volume = 0;
   	this.showControlsTimer.destroy();
   	this.timesUpTimer.destroy();
	// Go out in a blaze of glory...
	Phaser.Sprite.prototype.destroy.call(this);
};

Priest.prototype.showControls = function(){
	this.controlsShowing = true;
	this.checkingKeys = this.keys.concat();
    // Create the controls from the keys passed in.
    this.controlsBG.visible = true;
    // Loop through the icons and move them accordingly
    var leftPos = -(this.iconSize / 2) * (this.keys.length - 1);
	var len = this.keys.length;
	for(var i = 0; i < len; i++)
	{
		var icon = this.icons[i];
		icon.x = leftPos + this.iconSize * i;
		if(icon instanceof Phaser.Text)
			icon.x += 6;
		icon.visible = true;
	}
    this.timesUpTimer.add(Phaser.Timer.SECOND * this.inputTime, this.timesUp, this);
    this.timesUpTimer.start();
};

Priest.prototype.timesUp = function(){
    this.hideControls();
    // If any checking keys are left, the player failed to hit all my keys.
    if(this.checkingKeys.length > 0)
    	this.failedToHitKeys();
};

Priest.prototype.hideControls = function(){
	this.controlsShowing = false;
    this.controlsBG.visible = false;
    // If a level up was pending, level up!
    if(this.levelUpPending)
    	this.levelUp();
    this.showControlsTimer.add(Phaser.Timer.SECOND * this.showingTime, this.showControls, this);
    this.showControlsTimer.start();
};

Priest.prototype.keyHit = function(){
	this.checkingKeys.shift();
	var len = this.controlsBG.children.length;
	for(var i = 0; i < len; i++)
	{
		var icon = this.controlsBG.getChildAt(i);
		// get the next visible icon, we know it was a success
		if(!icon.visible)
			continue;
		this.emitter.x = icon.world.x + (this.iconSize / 2);
		this.emitter.y = icon.world.y + (this.iconSize / 2);
	    this.emitter.start(true, 400, null, 60);
		icon.visible = false;
		break;
	}
	this.onSuccessfulInput.dispatch(this);
	// If there are no more keys to check, the chant was a success
	if(this.checkingKeys.length == 0)
		this.allKeysHit();
};

Priest.prototype.failedToHitKeys = function(){
	// Add a jitter to show which one failed
	this.game.add.tween(this).to({x:this.x - 2}, 25, Phaser.Easing.Linear.None, true, 0, 2, true);
    this.onFailedChant.dispatch(this);
}

Priest.prototype.allKeysHit = function(){
	this.timesUpTimer.stop(true);
	this.onSuccessfulChant.dispatch(this);
	this.hideControls();
};

// addKeys passes the printable character key and the event. The event hold the key code so we use that.
Priest.prototype.onKeyPress = function(keyCode){
	if(!this.controlsShowing)
		return false;
	// Keys MUST be pressed in order!
	var keyToCheck = this.checkingKeys[0];
	if(keyCode == keyToCheck) // A match! Remove the key from the interface.
	{
		this.keyHit();
		return true;
	}
	return false;
};

Priest.prototype.kill = function(){
	tween = this.game.add.tween(this).to({alpha:0}, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
	tween.onComplete.add(this.destroy, this);
	//this.destroy();
};