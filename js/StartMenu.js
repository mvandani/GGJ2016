var menu = function(game){
};
 
menu.prototype = {
    preload: function(){
    },
    create: function(){
        // Create images in the main menu???
        this.game.add.sprite(this.game.rnd.integerInRange(0, this.game.world.width), this.game.rnd.integerInRange(0, this.game.world.height), 'mic');
        this.game.add.sprite(this.game.rnd.integerInRange(0, this.game.world.width), this.game.rnd.integerInRange(0, this.game.world.height), 'jen');
        this.game.add.sprite(this.game.rnd.integerInRange(0, this.game.world.width), this.game.rnd.integerInRange(0, this.game.world.height), 'mvd');
        this.game.add.sprite(this.game.rnd.integerInRange(0, this.game.world.width), this.game.rnd.integerInRange(0, this.game.world.height), 'tnh');
        this.game.add.sprite(this.game.rnd.integerInRange(0, this.game.world.width), this.game.rnd.integerInRange(0, this.game.world.height), 'kev');
        this.game.add.sprite(this.game.rnd.integerInRange(0, this.game.world.width), this.game.rnd.integerInRange(0, this.game.world.height), 'srk');
        this.game.add.sprite(this.game.rnd.integerInRange(0, this.game.world.width), this.game.rnd.integerInRange(0, this.game.world.height), 'todd');
    },
    update: function(){
    },
    shutdown: function(){
    }
}