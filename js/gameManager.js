GameManager = function(game){
	this.game = game;
	// Create an array of key combinations we can use for the priests.
	// TODO: This should be randomized.
	this.priests = [{shownTime: 2, inputTime: 1, followerCount: 1, priest:"priest_1", keys: [Phaser.KeyCode.UP]},
				{shownTime: 3, inputTime: 1, followerCount: 2, priest:"priest_2", keys: [Phaser.KeyCode.DOWN]},
				{shownTime: 5, inputTime: 1, followerCount: 3, priest:"priest_3", keys: [Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT]},
				{shownTime: 7, inputTime: 2, followerCount: 4, priest:"priest_4", keys: [Phaser.KeyCode.W]},
				{shownTime: 10, inputTime: 2, followerCount: 5, priest:"priest_5", keys: [Phaser.KeyCode.S]},
				{shownTime: 15, inputTime: 3, followerCount: 6, priest:"priest_6", keys: [Phaser.KeyCode.A, Phaser.KeyCode.D]},
				{shownTime: 15, inputTime: 3, followerCount: 7, priest:"priest_7", keys: [Phaser.KeyCode.Q, Phaser.KeyCode.E]}
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
        // The followers for each level should be done programatically...
        this.followersNeededForEachLevel = [5, 15, 35, 60, 100, 150, 200];
    }
};
