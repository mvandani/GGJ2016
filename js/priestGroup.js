PriestGroup = function(game, priestData){
	Phaser.Group.call(this, game);
	this.priestData = priestData;
	this.maxPriests = 7;
	this.lastPriest = null;

	this.onPriestAdded = new Phaser.Signal();
	this.onPriestLost = new Phaser.Signal();
	this.onFollowersGained = new Phaser.Signal();
	this.onFollowersLost = new Phaser.Signal();
	this.onSuccessfulInput = new Phaser.Signal();
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

PriestGroup.prototype.addPriest = function(){
	if(this.children.length == this.maxPriests - 1)
		return;
	// Add a new priest after a successfull input
	// Priest(game, x, y, time, keys)
	var pd = this.priestData[this.children.length];
	var priest = this.add(new Priest(this.game, (this.children.length * 96) + 20, 0, pd));
	priest.onSuccessfulChant.add(this.onSuccessfulChant, this);
	priest.onFailedChant.add(this.onFailedChant, this);
	priest.onSuccessfulInput.add(this.priestSuccessfulInput, this);
	this.onPriestAdded.dispatch(priest);
	this.lastPriest = priest;
};

PriestGroup.prototype.onSuccessfulChant = function(priest){
	this.onFollowersGained.dispatch(priest.followerCount);
};

PriestGroup.prototype.onFailedChant = function(){
	this.onFollowersLost.dispatch(20);
	if(this.children.length == 0)
		console.log("YOU LOOOOOOOOOOSE");
	else // Reset the last priest to the last one in the group
		this.lastPriest = this.children[this.children.length - 1];
};

PriestGroup.prototype.priestSuccessfulInput = function(priest){
	this.onSuccessfulInput.dispatch(priest);
};

PriestGroup.prototype.killLeader = function(){
	// Blow up the last priest added?
	this.lastPriest.kill();
	this.lastPriest = this.children[this.children.length - 1];
};

PriestGroup.prototype.onKeyPress = function(keyCode){
	// Send the key code to all the priests
	var matchingKeyFound = false;
	this.forEach(function(priest){
		if(priest.onKeyPress(keyCode))
			matchingKeyFound = true;
	}, this, false, event);
	// If no priest answered with a success, remove some followers
	if(!matchingKeyFound)
		this.onFollowersLost.dispatch(2);
	return matchingKeyFound;
};

Object.defineProperty(PriestGroup.prototype, "numPriests", {
    get: function(){
        return this.children.length;
    }
});
