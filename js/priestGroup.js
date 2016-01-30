PriestGroup = function(game, priestData){
	Phaser.Group.call(this, game);
	this.priestData = priestData;
	this.maxPriests = 7;
	this.lastPriest = null;

    // Listen for the input on the keys
    this.game.input.keyboard.addCallbacks(this, null, null, this.onKeyPress);

    // Since arrow keys are not printable, we must check for those separately
    this.interactionKeys = this.game.input.keyboard.addKeys({ 'up': Phaser.KeyCode.UP, 'down': Phaser.KeyCode.DOWN, 'left': Phaser.KeyCode.LEFT, 'right': Phaser.KeyCode.RIGHT });
    this.interactionKeys.up.onDown.add(this.onDirectionKeyPress, this);
    this.interactionKeys.down.onDown.add(this.onDirectionKeyPress, this);
    this.interactionKeys.left.onDown.add(this.onDirectionKeyPress, this);
    this.interactionKeys.right.onDown.add(this.onDirectionKeyPress, this);

    this.gameStartTimer = this.game.time.create(true);
    this.gameStartTimer.add(Phaser.Timer.SECOND * 4, this.beginGame, this);
    this.gameStartTimer.start();
}

PriestGroup.prototype = Object.create(Phaser.Group.prototype);
PriestGroup.prototype.constructor = PriestGroup;

PriestGroup.prototype.update = function(){
	Phaser.Group.prototype.update.call(this);
};

PriestGroup.prototype.destroy = function(){
	this.interactionKeys.up.onDown.remove(this.onDirectionKeyPress, this);
    this.interactionKeys.down.onDown.remove(this.onDirectionKeyPress, this);
    this.interactionKeys.left.onDown.remove(this.onDirectionKeyPress, this);
    this.interactionKeys.right.onDown.remove(this.onDirectionKeyPress, this);
	// Go out in a blaze of glory...
	Phaser.Group.prototype.destroy.call(this);
};

PriestGroup.prototype.beginGame = function(){
	this.lastPriest = this.addPriest();
};

PriestGroup.prototype.addPriest = function(){
	if(this.children.length == this.maxPriests - 1)
		return this.lastPriest;
	// Add a new priest after a successfull input
	// Priest(game, x, y, time, keys)
	var pd = this.priestData[this.children.length];
	var priest = this.add(new Priest(this.game, (this.children.length * 96) + 20, 0, pd.priest, pd.shownTime, pd.inputTime, pd.keys));
	priest.onSuccessfulChant.add(this.onSuccessfulChant, this);
	priest.onFailedChant.add(this.onFailedChant, this);
	return priest;
};

PriestGroup.prototype.onSuccessfulChant = function(priest){
	console.log("JUMP IN!");
	// Only load up another priest if the LAST priest added is the one to make the jump in call.
	if(this.lastPriest == priest)
		this.lastPriest = this.addPriest();
};

PriestGroup.prototype.onFailedChant = function(){
	console.log("BLOW UP!");
	// Blow up the last priest added?
	this.lastPriest.kill();
	if(this.children.length == 0)
		console.log("YOU LOOOOOOOOOOSE");
	else // Reset the last priest to the last one in the group
		this.lastPriest = this.children[this.children.length - 1];
};

// onDown passes the key object, so we pass the event to the main key press handler.
PriestGroup.prototype.onDirectionKeyPress = function(key){
	this.onKeyPress(null, key.event);
};
// addKeys passes the printable character key and the event. The event hold the key code so we use that.
PriestGroup.prototype.onKeyPress = function(key, event){
	// Ensure all keycodes passed are uppercase
	if(key != null)
		keyCode = key.toUpperCase().charCodeAt(0);
	else
		keyCode = event.keyCode;
	// Send the key code to all the priests
	this.forEach(function(priest){
		priest.onKeyPress(keyCode);
	}, this, false, event);
};