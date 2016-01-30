PriestGroup = function(game){
	Phaser.Group.call(this, game);
	this.lastPriest = null;
	this.numPriests = 0;

	this.gainFollowers = new Phaser.Signal();
	this.onFailedChant = new Phaser.Signal();
	this.onSuccessfulInput = new Phaser.Signal();
	this.onPriestAdded = new Phaser.Signal();
	this.onPriestLost = new Phaser.Signal();


	this.onSuccessfulInput = new Phaser.Signal();
	this.onFailedInput = new Phaser.Signal();
}

PriestGroup.prototype = Object.create(Phaser.Group.prototype);
PriestGroup.prototype.constructor = PriestGroup;

PriestGroup.prototype.update = function(){
	Phaser.Group.prototype.update.call(this);
};

PriestGroup.prototype.destroy = function(){
	this.forEach(function(priest){
		priest.onSuccessfulChant.remove(this.onSuccessfulChant, this);
		priest.onFailedChant.remove(this.onFailedPriestChant, this);
		priest.onSuccessfulInput.remove(this.priestSuccessfulInput, this);
	}, this, false, event);
	// Go out in a blaze of glory...
	Phaser.Group.prototype.destroy.call(this);
};

PriestGroup.prototype.addPriest = function(){
	if(this.children.length == this.game.gameManager.maxPriests)
		return;
	// Add a new priest after a successfull input
	// Priest(game, x, y, time, keys)
	var pd = this.game.gameManager.priests[this.children.length];
	var priest = this.add(new Priest(this.game, (this.children.length * 96) + 20, 0, pd));
	priest.onSuccessfulChant.add(this.onSuccessfulChant, this);
	priest.onFailedChant.add(this.onFailedPriestChant, this);
	priest.onSuccessfulInput.add(this.priestSuccessfulInput, this);
	this.numPriests++;;
	this.lastPriest = priest;
	this.onPriestAdded.dispatch(priest);
};

PriestGroup.prototype.onSuccessfulChant = function(priest){
	this.gainFollowers.dispatch(priest.followerCount);
};

PriestGroup.prototype.onFailedPriestChant = function(){
	this.onFailedChant.dispatch();
	if(this.children.length > 0)
		this.lastPriest = this.children[this.children.length - 1];
};

PriestGroup.prototype.priestSuccessfulInput = function(priest){
	this.onSuccessfulInput.dispatch(priest);
};

PriestGroup.prototype.killLeader = function(){
	// Blow up the last priest added?
	this.lastPriest.onSuccessfulChant.remove(this.onSuccessfulChant, this);
	this.lastPriest.onFailedChant.remove(this.onFailedPriestChant, this);
	this.lastPriest.onSuccessfulInput.remove(this.priestSuccessfulInput, this);
	this.lastPriest.kill();
	this.numPriests--;
	this.lastPriest = this.children[this.children.length - 1];
	this.onPriestLost.dispatch();
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
		this.onFailedInput.dispatch();
	return matchingKeyFound;
};
