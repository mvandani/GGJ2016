PriestGroup = function(game, keys){
	Phaser.Group.call(this, game);
	this.keys = keys;
	this.maxPriests = 7;

    // Listen for the input on the keys
    this.game.input.keyboard.addCallbacks(this, null, null, this.onKeyPress);

    // Since arrow keys are not printable, we must check for those separately
    this.interactionKeys = this.game.input.keyboard.addKeys({ 'up': Phaser.KeyCode.UP, 'down': Phaser.KeyCode.DOWN, 'left': Phaser.KeyCode.LEFT, 'right': Phaser.KeyCode.RIGHT });
    this.interactionKeys.up.onDown.add(this.onDirectionKeyPress, this);
    this.interactionKeys.down.onDown.add(this.onDirectionKeyPress, this);
    this.interactionKeys.left.onDown.add(this.onDirectionKeyPress, this);
    this.interactionKeys.right.onDown.add(this.onDirectionKeyPress, this);

    // TODO: On a timer or when input is successful
    this.addPriest();
    this.addPriest();
    this.addPriest();
    this.addPriest();
    this.addPriest();
    this.addPriest();
}

PriestGroup.prototype = Object.create(Phaser.Group.prototype);
PriestGroup.prototype.constructor = PriestGroup;

PriestGroup.prototype.update = function(){
	Phaser.Group.prototype.update.call(this);
};

PriestGroup.prototype.destroy = function(){
    this.game.input.keyboard.removeKeyCapture(this.keys);
	this.interactionKeys.up.onDown.remove(this.onDirectionKeyPress, this);
    this.interactionKeys.down.onDown.remove(this.onDirectionKeyPress, this);
    this.interactionKeys.left.onDown.remove(this.onDirectionKeyPress, this);
    this.interactionKeys.right.onDown.remove(this.onDirectionKeyPress, this);
	// Go out in a blaze of glory...
	Phaser.Group.prototype.destroy.call(this);
};

PriestGroup.prototype.addPriest = function(){
	if(this.children.length == this.maxPriests - 1)
		return;
	// Add a new priest after a successfull input
	// Priest(game, x, y, time, keys)
	var priest = this.add(new Priest(this.game, this.children.length * 80, 0, this.children.length + 5, 2, this.keys[this.children.length]));
	priest.onSuccessfulChant.add(this.onSuccessfulChant, this);
	priest.onFailedChant.add(this.onFailedChant, this);

	// Add the priest's keys to the array to listen for
	this.keys = this.keys.concat(priest.keys);
};

PriestGroup.prototype.onSuccessfulChant = function(){
	console.log("JUMP IN!");
};

PriestGroup.prototype.onFailedChant = function(){
	console.log("BLOW UP!");
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