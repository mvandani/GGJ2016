var MainMenu = function(game){
    this.tf;
    this.selected;
    this.menuItems; // Menu items that can be selected
    this.menuState; // Which screen (main, instructions, credits)
    this.upKey;
    this.downKey;
    this.enterKey;
    this.backgroundSprite;
};

var graphicAssets = {
    menuBackground:{URL:'assets/images/Background.png', name:'background'},
    titleCard:{URL:'assets/images/Title card.png', name:'titleCard'}
};

var fontAssets = {
    menuFontStyle:{font: 'bold 35px Consolas', fill: '#000000', align: 'center'},
    instructionsFontStyle:{font: 'bold 35px Consolas', fill: '#880015', backgroundColor: '#BBBBBB', align: 'center'},
    creditsFontStyle:{font: 'bold 35px Consolas', fill: '#880015', backgroundColor: '#BBBBBB', align: 'center'},
};
 
MainMenu.prototype = {
	/* State methods */
	init: function(params){
        this.selected = 0;
        this.menuState = "Main";
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.enterKey.onDown.add(this.enterHandler, this);

        this.priest = this.add.audio('priest');
        this.conga = this.add.audio('conga');
        this.eGuitar = this.add.audio('e_guitar');
        this.trumpet = this.add.audio('trumpet');
        this.aGuitar = this.add.audio('a_guitar');
        this.sax = this.add.audio('sax');
        this.drums = this.add.audio('drums');

        switch (Math.floor(Math.random() * 7))
        {
            case 0:
                this.priest.play("", 0);
                break;
            case 1:
                this.conga.play("", 0);
                break;
            case 2:
                this.eGuitar.play("", 0);
                break;
            case 3:
                this.trumpet.play("", 0);
                break;
            case 4:
                this.aGuitar.play("", 0);
                break;
            case 5:
                this.sax.play("", 0);
                break;
            case 6:
                this.drums.play("", 0);
                break;
        }

        this.menuItems = [
            "Play",
            "Instructions",
            "Credits"
        ];
        this.showText = false;
	},
	preload: function(){
        this.game.load.image(graphicAssets.menuBackground.name, graphicAssets.menuBackground.URL);
        this.game.load.image(graphicAssets.titleCard.name, graphicAssets.titleCard.URL);
	},
	create: function(){
        this.backgroundSprite = this.game.add.sprite(0, 0, graphicAssets.menuBackground.name);
        this.titleCardSprite = this.game.add.sprite(15, -200, graphicAssets.titleCard.name);
        entranceTween = this.game.add.tween(this.titleCardSprite).to({y:15}, 1000, Phaser.Easing.Bounce.Out, true);
        entranceTween.onComplete.add(function() {
            this.addMenuListeners();
            this.showText = true;
        }, this);
	},
	update: function(){
        this.updateText();
	},
	render: function(){
	},
	shutdown: function(){
        this.titleCardSprite.destroy();
        this.tf.destroy();
	},
    enterHandler: function() {
        var test = "state was " + this.menuState;
        if (this.menuState == "Main") {
            if (this.selected == 0){
                this.game.state.start("GameState", false, false);
                // stop the music
                this.priest.destroy();
                this.conga.destroy();
                this.eGuitar.destroy();
                this.trumpet.destroy();
                this.aGuitar.destroy();
                this.sax.destroy();
                this.drums.destroy();
            } else if (this.selected == 1) {
                this.menuState = "Instructions";
            } else {
                this.menuState = "Credits";
            }
            this.removeMenuListeners();
        } else {
            this.menuState = "Main";
            this.selected = 0;
            this.addMenuListeners();
        }
        console.log(test + " now it is " + this.menuState);
    },
    updateText: function(){
        if(!this.showText)
            return;

        if (this.tf)
            this.tf.destroy();
        var text = '';
        var align = 'left';
        var x = 15;
        var y = 50;
        var anchorX = 0;
        var anchorY = 0;
        var font = fontAssets.menuFontStyle;
        if (this.menuState == "Main") {
            for (i = 0; i < this.menuItems.length; i++) {
                if (this.selected == i)
                    text += "> ";
                text += this.menuItems[i] + "\n";
            }
            x = 500;
        } else if (this.menuState == "Instructions") {
            text += 'A volcano has appeared on the island!\nHelp the priests perform their rituals!\nPress the keys when they light up to\nget the worshippers to make a sacrifice.\nTry to get a rhythm going and vanquish\nthe volcano!';
            y = 300;
            font = fontAssets.instructionsFontStyle;
        } else {
            text += 'Made by Massive Assets';
            align = 'center'
            x = this.game.world.centerX;
            y = this.game.world.centerY;
            anchorX = 0.5;
            anchorY = 0.5;
            font = fontAssets.creditsFontStyle;
        }
        this.tf = this.game.add.text(x, y, text, font);
        this.tf.align = align;
        this.tf.anchor.set(anchorX, anchorY);
    },
    upHandler: function(){
        this.selected = (this.selected + 2) % 3;
    },
    downHandler: function(){
        this.selected = (this.selected + 1) % 3;
    },
    addMenuListeners: function(){
        this.upKey.onDown.add(this.upHandler, this);
        this.downKey.onDown.add(this.downHandler, this);
    },
    removeMenuListeners: function(){
        this.upKey.onDown.remove(this.upHandler, this);
        this.downKey.onDown.remove(this.downHandler, this);
    }
}