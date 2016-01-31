PriestGroup = function(game){
	Phaser.Group.call(this, game);
	this.numPriests = 0;

	this.gainFollowers = new Phaser.Signal();
	this.onFailedChant = new Phaser.Signal();
	this.onSuccessfulInput = new Phaser.Signal();
	this.onPriestAdded = new Phaser.Signal();
	this.onPriestLost = new Phaser.Signal();
	this.onFailedInput = new Phaser.Signal();

	this.priestSpots = {0:null, 1:null, 2:null, 3:null, 4:null, 5:null, 6:null};

	this.hit = this.game.add.audio('hit');
	this.miss = this.game.add.audio('miss');
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

PriestGroup.prototype.addPriest = function(index){
	if(this.children.length == this.game.gameManager.maxPriests)
		return;
	// Update all the currently alive priests levels
	this.forEach(function(priest){
		priest.levelUp();
	}, this);
	// Add a new priest after a successfull input
	// Priest(game, x, y, time, keys)
	// When spawning, always try to grab the leftmost spot
	var priest = null;
	for(var i = 0; i < this.game.gameManager.maxPriests; i++)
	{
		if(this.priestSpots[i] == null)
		{
			var pd = this.game.gameManager.getRandomPriestData(index);
			var priest = this.add(new Priest(this.game, 0, 0, pd));
			priest.x = (i * 96) + 20;
			priest.y = 200;
			priest.enterScreen();
			this.priestSpots[i] = priest;
			break;
		}
	}
	if(priest != null)
	{
		priest.onSuccessfulChant.add(this.onSuccessfulChant, this);
		priest.onFailedChant.add(this.onFailedPriestChant, this);
		priest.onSuccessfulInput.add(this.priestSuccessfulInput, this);
		this.numPriests++;;
		this.onPriestAdded.dispatch(priest);
	}
};

PriestGroup.prototype.onSuccessfulChant = function(priest){
	this.gainFollowers.dispatch(priest.followerCount);
};

PriestGroup.prototype.onFailedPriestChant = function(){
	this.onFailedChant.dispatch();
};

PriestGroup.prototype.priestSuccessfulInput = function(priest){
	this.onSuccessfulInput.dispatch(priest);
};

PriestGroup.prototype.killPriest = function(){
	// Choose one at random!
	var randIndx = this.game.rnd.integerInRange(0, this.children.length -1);
	var unluckyPriest = this.getChildAt(randIndx);
	unluckyPriest.onSuccessfulChant.remove(this.onSuccessfulChant, this);
	unluckyPriest.onFailedChant.remove(this.onFailedPriestChant, this);
	unluckyPriest.onSuccessfulInput.remove(this.priestSuccessfulInput, this);
	// Relenquish his parking spot
	for(var i = 0; i < this.game.gameManager.maxPriests; i++)
	{
		if(this.priestSpots[i] == unluckyPriest)
		{
			this.priestSpots[i] = null;
			break;
		}
	}
	// Retunn the priestdata to the pool
	this.game.gameManager.returnPriestData(unluckyPriest.priestData);
	unluckyPriest.kill();
	this.numPriests--;
	this.onPriestLost.dispatch();
};

PriestGroup.prototype.onKeyPress = function(keyCode){
	// Send the key code to all the priests
	var matchingKeyFound = false;
	this.forEach(function(priest){
		if(priest.onKeyPress(keyCode))
		{
			matchingKeyFound = true;
			this.hit.play();
		}
	}, this, false, event);
	// If no priest answered with a success, remove some followers
	if(!matchingKeyFound)
	{
		this.onFailedInput.dispatch();
		this.miss.play();
	}
	return matchingKeyFound;
};
