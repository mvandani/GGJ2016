var LabelButton = function(game, x, y, key, labelText, style) {
	Phaser.Sprite.call(this, game, x, y, key);
	this.style = style || {
		'font': '200px Arial',
		'fill': 'black'
	};
	this.anchor.setTo(0.5, 0.5);

	this.label = new Phaser.Text(game, 0, 0, labelText, this.style);
	this.label.anchor.setTo(0.5, 0.5);
	this.addChild(this.label);
	this.setLabel(labelText);
};

LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton;

LabelButton.prototype.setLabel = function(label) {
	this.label.setText(label);
};
