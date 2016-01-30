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
		this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'LOSE');
	},
	update: function(){
	},
	render: function(){
	},
	shutdown: function(){
	}
}