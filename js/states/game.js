var GameState = function(game){
	// Create an array of key combinations we can use for the priests.
	// TODO: This should be randomized.
	this.priests = [{shownTime: 3, inputTime: 1, priest:"priest_1", keys: [Phaser.KeyCode.UP]},
				{shownTime: 5, inputTime: 1, priest:"priest_2", keys: [Phaser.KeyCode.DOWN]},
				{shownTime: 5, inputTime: 1, priest:"priest_3", keys: [Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT]},
				{shownTime: 7, inputTime: 2, priest:"priest_4", keys: [Phaser.KeyCode.X]},
				{shownTime: 10, inputTime: 2, priest:"priest_5", keys: [Phaser.KeyCode.W, Phaser.KeyCode.S]},
				{shownTime: 15, inputTime: 3, priest:"priest_6", keys: [Phaser.KeyCode.Q, Phaser.KeyCode.E]},
				{shownTime: 15, inputTime: 3, priest:"priest_7", keys: [Phaser.KeyCode.A, Phaser.KeyCode.D]}
	];
};
 
GameState.prototype = {
	/* State methods */
	create: function(){
		this.bg = this.game.add.sprite(0, 0, 'game_bg');
		// The group for the priests
		this.priestGroup = this.game.world.add(new PriestGroup(this.game, this.priests));
		// The group for the party goers
		this.worshipperGroup = this.game.world.add(new WorshipperGroup(this.game));
		this.priestGroup.x = 70;
		this.priestGroup.y = this.game.world.height - 128;
		this.elapsedSinceTime = this.game.time.now;
	},
	update: function(){
	},
	render: function(){
		this.game.debug.text("Time: " + (this.game.time.now - this.elapsedSinceTime), 32, this.game.world.height - 32);
	},
	shutdown: function(){
	}
}