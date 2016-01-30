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
    menuBackground:{URL:'assets/images/Title.png', name:'background'}
};

var fontAssets = {
    menuFontStyle:{font: 'bold 40px Arial', fill: '#000000', align: 'center'},
    instructionsFontStyle:{font: 'bold 35px Arial', fill: '#880015', backgroundColor: '#BBBBBB', align: 'center'},
    creditsFontStyle:{font: 'bold 40px Arial', fill: '#880015', backgroundColor: '#BBBBBB', align: 'center'},
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
        this.menuItems = [
            "Play",
            "Instructions",
            "Credits"
        ];
	},
	preload: function(){
        this.game.load.image(graphicAssets.menuBackground.name, graphicAssets.menuBackground.URL);
	},
	create: function(){
        this.addMenuListeners();
        this.backgroundSprite = this.game.add.sprite(0, 0, graphicAssets.menuBackground.name);
	},
	update: function(){
        this.updateText();
	},
	render: function(){
	},
	shutdown: function(){
	},
    enterHandler: function() {
        var test = "state was " + this.menuState;
        if (this.menuState == "Main") {
            if (this.selected == 0){
                this.game.state.start("GameState");
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
        if (this.tf)
            this.tf.destroy();
        var text = '';
        var align = 'left';
        var x = 50;
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
            text += 'Help the priests perform the __ ritual!\nPress the keys when they light up to\nget the worshippers to make a sacrifice.\nTry to get a rhythm going!';
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