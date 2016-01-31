GameManager = function(game){
	this.game = game;
	// Create an array of key combinations we can use for the priests.
	// TODO: This should be randomized.
	this.priests = [{shownTime: 3, inputTime: 2, followerCount: 1, priest: "novice", frames: [0,1,2,3,4,5], fps: 7, track: this.game.audioManager.priest, keys: [Phaser.KeyCode.UP, Phaser.KeyCode.DOWN]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "monk", frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], fps: 7, track: this.game.audioManager.conga, keys: [Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "harp_lady", frames: [0,1,2,3,4,5,6,7,8,9,10], fps: 7, track: this.game.audioManager.aGuitar, keys: [Phaser.KeyCode.W, Phaser.KeyCode.S]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "geese", frames: [0,1,2,3,4,5,6,7], fps: 6, track: this.game.audioManager.sax, keys: [Phaser.KeyCode.A, Phaser.KeyCode.D]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "shadow", frames: [0,1], fps: 2, track: this.game.audioManager.drums, keys: [Phaser.KeyCode.Q, Phaser.KeyCode.E]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "idol", frames: [0,1,2,3,4,5], fps: 7, track: this.game.audioManager.trumpet, keys: [Phaser.KeyCode.C, Phaser.KeyCode.V]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "nun", frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], fps: 7, track: this.game.audioManager.eGuitar, keys: [Phaser.KeyCode.F, Phaser.KeyCode.G]}
	];
    this.reset();
};

GameManager.prototype.constructor = GameManager;

GameManager.prototype = {
	reset: function(){
        this.maxPriests = 7;
        this.followersNeeded = 200;
        this.totalPopulation = 50;
        this.followersPenalty = 2;
		this.followerPenaltyThreshold = 20;
		this.failedChantPenalty = 2;
		this.totalFollowers = 0;
		this.totalDefectors = 0;
        // The followers for each level should be done programatically...
        this.followersNeededForEachLevel = [5, 15, 35, 60, 100, 150, 200];
        this.priestsToChooseFrom = this.priests.concat();
        this.game.input.keyboard.reset();
    },
    // Passing in an index will force a return of that index
    getRandomPriestData: function(index){
    	if(typeof(index) !== 'undefined')
    		return this.priestsToChooseFrom.splice(index, 1)[0];
    	var randIndex = this.game.rnd.integerInRange(0, this.priestsToChooseFrom.length - 1);
    	return this.priestsToChooseFrom.splice(randIndex, 1)[0];
    },
    returnPriestData: function(priestData){
    	this.priestsToChooseFrom.push(priestData);
    },
};
