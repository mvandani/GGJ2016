var Preload = function(game){
};

Preload.prototype = {
	/* State methods */
	init: function(params){
	},
	loadImages: function() {

	},
	loadAudio: function() {
		this.game.load.audio('flying0',["assets/audio/flying0.mp3"]);
		this.game.load.audio('flying1',["assets/audio/flying1.mp3"]);
		this.game.load.audio('flying2',["assets/audio/flying2.mp3"]);
		this.game.load.audio('flying3',["assets/audio/flying3.mp3"]);
		this.game.load.audio('flying4',["assets/audio/flying4.mp3"]);

		this.game.load.audio('good0',["assets/audio/good0.mp3"]);
		this.game.load.audio('good1',["assets/audio/good1.mp3"]);
		this.game.load.audio('good2',["assets/audio/good2.mp3"]);
		this.game.load.audio('good3',["assets/audio/good3.mp3"]);
		this.game.load.audio('good4',["assets/audio/good4.mp3"]);
		this.game.load.audio('good5',["assets/audio/good5.mp3"]);
		this.game.load.audio('good6',["assets/audio/good6.mp3"]);
		this.game.load.audio('good7',["assets/audio/good7.mp3"]);
		this.game.load.audio('good8',["assets/audio/good8.mp3"]);
		this.game.load.audio('good9',["assets/audio/good9.mp3"]);

		this.game.load.audio('hit0',["assets/audio/hit0.mp3"]);
		this.game.load.audio('hit1',["assets/audio/hit1.mp3"]);
		this.game.load.audio('hit2',["assets/audio/hit2.mp3"]);
		this.game.load.audio('hit3',["assets/audio/hit3.mp3"]);
		this.game.load.audio('hit4',["assets/audio/hit4.mp3"]);

		this.game.load.audio('punch0',["assets/audio/punch0.mp3"]);
		this.game.load.audio('punch1',["assets/audio/punch1.mp3"]);
		this.game.load.audio('punch2',["assets/audio/punch2.mp3"]);
		this.game.load.audio('punch3',["assets/audio/punch3.mp3"]);
		this.game.load.audio('punch4',["assets/audio/punch4.mp3"]);
	},

	preload: function(){
		this.loadImages();
		this.loadAudio();
	},
	create: function(){
		var game = this.game;
		game.state.start("MainMenu");
	},
	update: function(){
	},
	render: function(){
	},
	shutdown: function(){
	}
}