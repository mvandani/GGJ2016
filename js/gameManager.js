GameManager = function(game){
	this.game = game;
	// Create an array of key combinations we can use for the priests.
	// TODO: This should be randomized.
	this.priests = [{shownTime: 3, inputTime: 2, followerCount: 1, priest: "novice", track: this.game.audioManager.priest, keys: [Phaser.KeyCode.UP, Phaser.KeyCode.DOWN]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "monk", track: this.game.audioManager.conga, keys: [Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "harp_lady", track: this.game.audioManager.aGuitar, keys: [Phaser.KeyCode.W, Phaser.KeyCode.S]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "geese", track: this.game.audioManager.sax, keys: [Phaser.KeyCode.A, Phaser.KeyCode.D]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "shadow", track: this.game.audioManager.drums, keys: [Phaser.KeyCode.Q, Phaser.KeyCode.E]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "idol", track: this.game.audioManager.trumpet, keys: [Phaser.KeyCode.C, Phaser.KeyCode.V]},
				{shownTime: 3, inputTime: 2, followerCount: 1, priest: "nun", track: this.game.audioManager.eGuitar, keys: [Phaser.KeyCode.F, Phaser.KeyCode.G]}
	];
    this.reset();
};

GameManager.prototype.constructor = GameManager;

GameManager.prototype = {
	reset: function(){
        this.maxPriests = 7;
        this.followersNeeded = 200;
        this.totalPopulation = 300;
        this.followersPenalty = 2;
		this.followerPenaltyThreshold = 20;
		this.failedChantPenalty = 2;
        // The followers for each level should be done programatically...
        this.followersNeededForEachLevel = [5, 15, 35, 60, 100, 150, 200];
    }
};
