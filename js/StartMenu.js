ReGame.StartMenu = function(game) {
    this.titleImage;
    this.startPrompt;
}

ReGame.StartMenu.prototype = {
    create: function() {
        startBG = this.add.image(0,0, 'startBG');
        titleImage = this.add.image(this.world.centerX, this.world.centerY, 'titleImage');
        titleImage.anchor.setTo(0,0)
    }
}