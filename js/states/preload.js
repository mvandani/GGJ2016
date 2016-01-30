var Preload = function(game){
};
 
Preload.prototype = {
	/* State methods */
	init: function(params){
	},
	preload: function(){
		this.game.stage.backgroundColor = "0x0099ff";

		// Priests
		this.game.load.image('priest_1', 'assets/images/Priest 1.png');
		this.game.load.image('priest_2', 'assets/images/Priest 2.png');
		//this.game.load.image('priest_3', 'assets/images/Priest 3.png');
		//this.game.load.image('priest_4', 'assets/images/Priest 4.png');
		this.game.load.image('priest_5', 'assets/images/Priest 1.png');
		this.game.load.image('priest_6', 'assets/images/Priest 1.png');
		this.game.load.image('priest_7', 'assets/images/Priest 1.png');

		this.game.load.image('up', 'assets/images/up.png');
		this.game.load.image('down', 'assets/images/down.png');
		this.game.load.image('left', 'assets/images/left.png');
		this.game.load.image('right', 'assets/images/right.png');

		// Backgrounds
		this.game.load.image('game_bg', 'assets/images/Volcano.png');

		// Particles
		this.game.load.image('key_particle', 'assets/images/particle.png');

		this.game.load.json('iconLookup', 'assets/data/keyIconLookup.json');

		// Spritesheets
		this.game.load.spritesheet('priest_3', 'assets/images/Priest 3.png', 96, 128);
		this.game.load.spritesheet('priest_4', 'assets/images/Priest 4.png', 96, 128);
		this.game.load.spritesheet('followers', 'assets/images/Follower idles.png', 33, 93);

		// Load the game audio
    	this.game.load.audio('track1', 'assets/sound/music/Priest.mp3');
    	this.game.load.audio('track2', 'assets/sound/music/A-Guitar.mp3');
    	this.game.load.audio('track3', 'assets/sound/music/Conga.mp3');
    	this.game.load.audio('track4', 'assets/sound/music/Drums.mp3');
    	this.game.load.audio('track5', 'assets/sound/music/E-Guitar.mp3');
    	this.game.load.audio('track6', 'assets/sound/music/Trumpet.mp3');
	},
	create: function(){
		// For the particles
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.gameManager = new GameManager(this.game);
	    this.game.audioManager = new AudioManager(this.game);

		this.game.audioManager.track1 = this.game.add.audio('track1', 0, true);
		this.game.audioManager.track2 = this.game.add.audio('track2', 0, true);
		this.game.audioManager.track3 = this.game.add.audio('track3', 0, true);
		this.game.audioManager.track4 = this.game.add.audio('track4', 0, true);
		this.game.audioManager.track5 = this.game.add.audio('track5', 0, true);
		this.game.audioManager.track6 = this.game.add.audio('track6', 0, true);
		this.game.audioManager.track7 = this.game.add.audio('track6', 0, true);
		this.game.sound.setDecodedCallback([ this.game.audioManager.track1,
											this.game.audioManager.track2,
											this.game.audioManager.track3,
											this.game.audioManager.track4,
											this.game.audioManager.track5,
											this.game.audioManager.track6,
											this.game.audioManager.track7], this.onAudioLoaded, this);
	},
	update: function(){
	},
	render: function(){
	},
	shutdown: function(){
	},
	onAudioLoaded: function(){
		// Play and pause so we can resume later
		// ALL THE SONGS WILL BE PLAYING AT ONCE.
		// We just adjust the volume to hide them, so bad but who cares!
		this.game.audioManager.setUpTracks();
		// Give the priests a random track, except for priest 1
		this.game.gameManager.priests[0].track = this.game.audioManager.track1;
		for(var i = 1; i < this.game.gameManager.priests.length; i++)
		{
			var priest = this.game.gameManager.priests[i];
			priest.track = this.game.audioManager.getRandomTrack();
			console.log("setting track index", priest.track);
		}
		this.game.state.start("MainMenu", true, false);
	}
}