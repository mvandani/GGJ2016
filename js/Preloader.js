ReGame.Preloader = function(game) {
    this.preloadBar = null;
    this.titleImage = null;
    this.ready = false;
};

ReGame.Preloader.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar);
        this.titleImage = this.add.image(this.world.centerX, this.world.centerY-100, 'titleImage');
        this.titleImage.anchor.setTo(0.5, 0.5);
        //do fonts?
        this.load.image('startBG', 'images/start_bg.png');
    },
    
    create: function() {
        this.preloadBar.cropEnabled = false;
    },
    
    update: function() {
        this.ready = true;
        this.state.start('StartMenu');
    }
}