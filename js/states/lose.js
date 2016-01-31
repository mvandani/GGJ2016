var Lose = function(game){
};
 
Lose.prototype = {
	/* State methods */
	init: function(params){
	},
	preload: function(){
	},
	create: function(){
		this.bg = this.game.add.sprite(0, 0, 'game_bg');
		var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'LOSE');
        text.align = 'center';
        text.anchor.set(0.5, 0.5);
        
        this.gameOver = this.game.add.audio('game_over');
        this.gameOver.play();

        var enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.addOnce(this.enterHandler, this);
	},
	update: function(){
	},
	render: function(){
	},
	shutdown: function(){
	},
    enterHandler: function(){
    	
    	this.gameOver.destroy();
        this.game.gameManager.reset();
        this.game.state.start("MainMenu");
    }
}