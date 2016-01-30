var GameState = function(game){
	// Create an array of key combinations we can use for the priests.
	// TODO: This should be randomized.
	this.keys = [[Phaser.KeyCode.UP],
				[Phaser.KeyCode.DOWN],
				[Phaser.KeyCode.LEFT],
				[Phaser.KeyCode.RIGHT],
				[Phaser.KeyCode.A],
				[Phaser.KeyCode.B],
				[Phaser.KeyCode.C],
				[Phaser.KeyCode.D],
				[Phaser.KeyCode.E],
				[Phaser.KeyCode.F],
				[Phaser.KeyCode.G],
				[Phaser.KeyCode.H],
				[Phaser.KeyCode.I],
				[Phaser.KeyCode.J],
				[Phaser.KeyCode.K],
				[Phaser.KeyCode.L],
				[Phaser.KeyCode.M],
				[Phaser.KeyCode.N],
				[Phaser.KeyCode.O],
				[Phaser.KeyCode.P],
				[Phaser.KeyCode.Q],
				[Phaser.KeyCode.R],
				[Phaser.KeyCode.S],
				[Phaser.KeyCode.T],
				[Phaser.KeyCode.U],
				[Phaser.KeyCode.V],
				[Phaser.KeyCode.W],
				[Phaser.KeyCode.X],
				[Phaser.KeyCode.Y],
				[Phaser.KeyCode.Z]
	];
};
 
GameState.prototype = {
	/* State methods */
	create: function(){
		// The group for the priests
		this.priestGroup = this.game.world.add(new PriestGroup(this.game, this.keys));
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