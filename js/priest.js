Priest = function(game, x, y, showingTime, inputTime, keys){
	// InputTime MUST be shorter than showingTime!
	Phaser.Sprite.call(this, game, x, y, 'priest', 0);
	this.showingTime = showingTime;
	this.inputTime = inputTime;
	this.keys = keys;
	this.icons = [];
	this.controlsShowing = false;

    var controlsHeight = keys.length * 16;
	this.controlsBG = this.addChild(new Phaser.Graphics(this.game, 50, 16));
    // set a fill and line style
    this.controlsBG.beginFill(0xFFFFFF);
    this.controlsBG.lineStyle(2, 0x000000, 1);
    this.controlsBG.drawRoundedRect(0, 0, 16, controlsHeight, 4);
    this.controlsBG.endFill();
    this.controlsBG.visible = false;

    this.onSuccessfulChant = new Phaser.Signal();
    this.onFailedChant = new Phaser.Signal();

	this.iconLookup = this.game.cache.getJSON('iconLookup');

	// Create all the icons and keys to use.
	// Text will be used for the characters.
	this.createIcons();

    this.timesUpTimer = this.game.time.create(false);
    this.showControlsTimer = this.game.time.create(false);
    this.showControlsTimer.loop(Phaser.Timer.SECOND * this.showingTime, this.showControls, this);
    this.showControlsTimer.start();
};

Priest.prototype = Object.create(Phaser.Sprite.prototype);
Priest.prototype.constructor = Priest;

Priest.prototype.createIcons = function(){
	var len = this.keys.length;
	for(var i = 0; i < len; i++)
	{
		var keyCode = this.keys[i];
		var icon = null;
		if(keyCode == Phaser.KeyCode.UP || keyCode == Phaser.KeyCode.DOWN || keyCode == Phaser.KeyCode.LEFT || keyCode == Phaser.KeyCode.RIGHT)
			icon = this.addChild(new Phaser.Sprite(this.game, 50, 0, this.iconLookup[keyCode], 0));
		else
			icon = this.addChild(new Phaser.Text(this.game, 53, 0, String.fromCharCode(keyCode), {fontSize: 14, fontWeight: "bold", fill: "0x000000"}));
		icon.visible = false;
		this.icons.push(icon);
	}
};

Priest.prototype.update = function(){
	Phaser.Sprite.prototype.update.call(this);
};

Priest.prototype.destroy = function(){
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
	var len = this.keys.length;
	for(var i = 0; i < len; i++)
	{
		var icon = this.icons[i];
		icon.y = 16 * (i + 1);
		icon.visible = true;
	}
    this.timesUpTimer.add(Phaser.Timer.SECOND * this.inputTime, this.timesUp, this);
    this.timesUpTimer.start();
};

Priest.prototype.timesUp = function(){
    this.hideControls();
    // If any checking keys are left, the player failed to hit all my keys.
    if(this.checkingKeys.length > 0)
    {
    	this.onFailedChant.dispatch(this);
    	this.destroy();
    }
};

Priest.prototype.hideControls = function(){
	this.controlsShowing = false;
    this.controlsBG.visible = false;
};

Priest.prototype.allKeysHit = function(){
	this.onSuccessfulChant.dispatch(this);
	this.hideControls();
};

// addKeys passes the printable character key and the event. The event hold the key code so we use that.
Priest.prototype.onKeyPress = function(keyCode){
	if(!this.controlsShowing)
		return;
	// Keys MUST be pressed in order!
	var keyToCheck = this.checkingKeys[0];
	if(keyCode == keyToCheck)
	{
		// A match! Remove the key from the interface.
		this.checkingKeys.shift();
	}
	// If there are no more keys to check, the chant was a success
	if(this.checkingKeys.length == 0)
		this.allKeysHit();
};
