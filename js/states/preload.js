var Preload = function(game){
};
 
Preload.prototype = {
	/* State methods */
	init: function(params){
	},
	preload: function(){
		this.game.stage.backgroundColor = "0x0099ff";

		this.game.load.image('up', 'assets/images/up.png');
		this.game.load.image('down', 'assets/images/down.png');
		this.game.load.image('left', 'assets/images/left.png');
		this.game.load.image('right', 'assets/images/right.png');
		this.game.load.image('true_worshipper', 'assets/images/follower-3.png');
		this.game.load.image('defector', 'assets/images/follower-1.png');

		// Scale
		this.game.load.image('scale_fulcrum', 'assets/images/Scale fulcrum.png');
		this.game.load.image('scale_beam', 'assets/images/Scale beam.png');
		this.game.load.image('scale_platform', 'assets/images/Scale platform.png');

		// Backgrounds
		this.game.load.image('cloud1', 'assets/images/Cloud 1.png');
		this.game.load.image('cloud2', 'assets/images/Cloud 2.png');
		this.game.load.image('cloud3', 'assets/images/Cloud 3.png');
		this.game.load.image('game_bg', 'assets/images/Background.png');
		this.game.load.image('volcano', 'assets/images/Volcano.png');

		// Particles
		this.game.load.image('key_particle', 'assets/images/particle.png');

		this.game.load.json('iconLookup', 'assets/data/keyIconLookup.json');

		// Spritesheets
		this.game.load.spritesheet('idol', 'assets/images/priests/Idol.png', 96, 128);
		this.game.load.spritesheet('nun', 'assets/images/priests/Nun.png', 96, 128);
		this.game.load.spritesheet('geese', 'assets/images/priests/GeesePriest.png', 96, 128);
		this.game.load.spritesheet('harp_lady', 'assets/images/priests/HarpLady.png', 96, 128);
		this.game.load.spritesheet('monk', 'assets/images/priests/Monk.png', 96, 128);
		this.game.load.spritesheet('novice', 'assets/images/priests/Novice.png', 96, 128);
		this.game.load.spritesheet('shadow', 'assets/images/priests/Shadow.png', 96, 128);
		this.game.load.spritesheet('followers', 'assets/images/follower.png', 36, 93);
		this.game.load.spritesheet('smoke', 'assets/images/Smoke.png', 96, 96);

		// Load the game audio
    	this.game.load.audio('priest', 'assets/sound/music/Priest.mp3');
    	this.game.load.audio('a_guitar', 'assets/sound/music/A-Guitar.mp3');
    	this.game.load.audio('conga', 'assets/sound/music/Conga.mp3');
    	this.game.load.audio('drums', 'assets/sound/music/Drums.mp3');
    	this.game.load.audio('e_guitar', 'assets/sound/music/E-Guitar.mp3');
    	this.game.load.audio('trumpet', 'assets/sound/music/Trumpet.mp3');
    	this.game.load.audio('sax', 'assets/sound/music/Sax.mp3');
    	this.game.load.audio('game_over', 'assets/sound/music/GameOver.mp3')
        // and fx
    	this.game.load.audio('scream', 'assets/sound/fx/WilhelmScream.mp3');
    	this.game.load.audio('explosion', 'assets/sound/fx/Explosion.mp3');
    	this.game.load.audio('hit', 'assets/sound/fx/Hit.mp3');
    	this.game.load.audio('miss', 'assets/sound/fx/Miss.mp3');
    	this.game.load.audio('level_down', 'assets/sound/fx/LevelDown.mp3');
    	this.game.load.audio('level_up', 'assets/sound/fx/LevelUp.mp3');
	},
	create: function(){
		// For the particles
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
	    this.game.audioManager = new AudioManager(this.game);

		this.game.audioManager.priest = this.game.add.audio('priest', 0, true);
		this.game.audioManager.conga = this.game.add.audio('conga', 0, true);
		this.game.audioManager.eGuitar = this.game.add.audio('e_guitar', 0, true);
		this.game.audioManager.trumpet = this.game.add.audio('trumpet', 0, true);
		this.game.audioManager.aGuitar = this.game.add.audio('a_guitar', 0, true);
		this.game.audioManager.sax = this.game.add.audio('sax', 0, true);
		this.game.audioManager.drums = this.game.add.audio('drums', 0, true);
		this.game.sound.setDecodedCallback([ this.game.audioManager.priest,
											this.game.audioManager.conga,
											this.game.audioManager.eGuitar,
											this.game.audioManager.trumpet,
											this.game.audioManager.aGuitar,
											this.game.audioManager.sax,
											this.game.audioManager.drums], this.onAudioLoaded, this);
	},
	update: function(){
	},
	render: function(){
	},
	shutdown: function(){
	},
	onAudioLoaded: function(){
		this.game.gameManager = new GameManager(this.game);
		this.game.state.start("MainMenu", true, false);
	}
}