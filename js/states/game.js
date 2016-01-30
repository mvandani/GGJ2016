var GameState = function(game){
	// Create an array of key combinations we can use for the priests.
	// TODO: This should be randomized.
	this.priests = [{shownTime: 2, inputTime: 1, followerCount: 5, priest:"priest_1", keys: [Phaser.KeyCode.UP]},
				{shownTime: 3, inputTime: 1, followerCount: 7, priest:"priest_2", keys: [Phaser.KeyCode.DOWN]},
				{shownTime: 5, inputTime: 1, followerCount: 9, priest:"priest_3", keys: [Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT]},
				{shownTime: 7, inputTime: 2, followerCount: 12, priest:"priest_4", keys: [Phaser.KeyCode.W]},
				{shownTime: 10, inputTime: 2, followerCount: 15, priest:"priest_5", keys: [Phaser.KeyCode.S]},
				{shownTime: 15, inputTime: 3, followerCount: 18, priest:"priest_6", keys: [Phaser.KeyCode.A, Phaser.KeyCode.D]},
				{shownTime: 15, inputTime: 3, followerCount: 20, priest:"priest_7", keys: [Phaser.KeyCode.Q, Phaser.KeyCode.E]}
	];
};
 
GameState.prototype = {
	/* State methods */
	create: function(){
		this.bg = this.game.add.sprite(0, 0, 'game_bg');

		this.introTime = 3;
		this.introText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Get ready!', {fontSize: 72});
		this.introText.anchor.setTo(0.5, 0.5);
		this.introTimer = this.game.time.create(true);
		this.introTimer.loop(Phaser.Timer.SECOND * 1, this.updateIntroText, this);
		this.introTimer.start();

	    // Listen for the input on the keys
	    this.game.input.keyboard.addCallbacks(this, null, null, this.onKeyPress);

	    // Since arrow keys are not printable, we must check for those separately
	    this.interactionKeys = this.game.input.keyboard.addKeys({ 'up': Phaser.KeyCode.UP, 'down': Phaser.KeyCode.DOWN, 'left': Phaser.KeyCode.LEFT, 'right': Phaser.KeyCode.RIGHT });
	    this.interactionKeys.up.onDown.add(this.onDirectionKeyPress, this);
	    this.interactionKeys.down.onDown.add(this.onDirectionKeyPress, this);
	    this.interactionKeys.left.onDown.add(this.onDirectionKeyPress, this);
	    this.interactionKeys.right.onDown.add(this.onDirectionKeyPress, this);

		// The group for the priests
		this.priestGroup = this.game.world.add(new PriestGroup(this.game, this.priests));
		this.priestGroup.onPriestAdded.add(this.onPriestAdded, this);
		this.priestGroup.onPriestLost.add(this.onPriestLost, this);
		this.priestGroup.onFollowersGained.add(this.onFollowersGained, this);
		this.priestGroup.onFollowersLost.add(this.onFollowersLost, this);
		this.priestGroup.onSuccessfulInput.add(this.onSuccessfulInput, this);
		this.priestGroup.x = 70;
		this.priestGroup.y = this.game.world.height - 180;
		// The group for the party goers
		this.worshipperGroup = this.game.world.add(new WorshipperGroup(this.game));
		this.lastSuccessfulPriest = null;

		this.totalFollowers = 0;
		this.followersNeeded = 1000;

		// The followers for each level should be done programatically...
		this.followersNeededForEachLevel = [25, 75, 175, 325, 525, 775, 1000];

		// Follower gauge
		this.gaugeWidth = 512;
		this.guageX = (this.game.world.width / 2) - (this.gaugeWidth / 2);
	    this.followersGaugeBG = this.game.add.graphics(this.guageX, this.game.world.height - 35);
	    this.followersGaugeBG.beginFill(0xFF0000);
	    this.followersGaugeBG.drawRect(0, 0, this.gaugeWidth, 32);
	    this.followersGaugeBG.endFill();
	    this.followersGauge = this.game.add.graphics(this.guageX, this.game.world.height - 35);
	    this.followersGauge.beginFill(0x00FF00);
	    this.followersGauge.drawRect(0, 0, 1, 32);
	    this.followersGauge.endFill();
	    //this.followersGauge.angle = 180;
		this.followersGaugeOutline = this.game.add.graphics(this.guageX, this.game.world.height - 35);
	    this.followersGaugeOutline.lineStyle(2, 0x000000, 1);
	    this.followersGaugeOutline.drawRect(0, 0, this.gaugeWidth, 32);
	    for(var i = 0; i < 7; i++)
	    {
	    	var numFollowers = this.followersNeededForEachLevel[i];
	    	var yRatio = numFollowers / this.followersNeeded;
	    	this.followersGaugeOutline.moveTo(yRatio * this.gaugeWidth, 32);
	    	this.followersGaugeOutline.lineTo(yRatio * this.gaugeWidth, -10);
	    }

		this.elapsedSinceTime = this.game.time.now;

		this.comboText = this.game.add.text(660, this.game.world.height - 30, 'Combo: 0', {fontSize: 22, fill: "#FFFFFF"});
		this.combo = 0;
		this.comboText.visible = false;
		this.comboFloat = this.game.add.text(0, 0, '25x', {fontSize: 22, fill: "#00FF00"});
		this.comboFloat.alpha = 0;

	    this.gameStartTimer = this.game.time.create(true);
	    this.gameStartTimer.add(Phaser.Timer.SECOND * 4, this.beginGame, this);
	    this.gameStartTimer.start();
	},
	update: function(){
	},
	render: function(){
		this.game.debug.text("Time: " + (this.game.time.now - this.elapsedSinceTime), 32, this.game.world.height - 32);
	},
	shutdown: function(){
	},
	beginGame: function(){
		this.introTimer.destroy();
		this.priestGroup.addPriest();
	},
	updateIntroText: function(){
		this.introText.text = this.introTime--;
		if(this.introTime < 0)
			this.introText.visible = false;
	},
	// onDown passes the key object, so we pass the event to the main key press handler.
	onDirectionKeyPress: function(key){
		this.onKeyPress(null, key.event);
	},
	// addKeys passes the printable character key and the event. The event hold the key code so we use that.
	onKeyPress: function(key, event){
		// Ensure all keycodes passed are uppercase
		if(key != null)
			keyCode = key.toUpperCase().charCodeAt(0);
		else
			keyCode = event.keyCode;
		// Add to the combo if the press was a success
		if(this.priestGroup.onKeyPress(keyCode))
			this.combo++;
		else
			this.combo = 0;
		this.comboText.text = "Combo: " + this.combo;
		if(this.combo > 5)
			this.comboText.visible = true;
		else
			this.comboText.visible = false;
		// If the combo is at an interval of 5, show a floating combo text at the priest
		if(this.combo > 0 && this.combo % 5  == 0)
		{
			this.comboFloat.text = this.combo + "x!";
			this.comboFloat.x = this.lastSuccessfulPriest.world.x + (this.lastSuccessfulPriest.width / 2) - 12;
			this.comboFloat.y = this.lastSuccessfulPriest.world.y;
			this.comboFloat.alpha = 1;
			this.game.add.tween(this.comboFloat).to({y: this.comboFloat.y - 25, alpha: 0}, 650, Phaser.Easing.Linear.None, true, 0);
		}

	},
	onSuccessfulInput: function(priest){
		// Set the last preist as the last one to hit a success
		this.lastSuccessfulPriest = priest;
	},
	onPriestAdded: function(priest){
		
	},
	onPriestLost: function(){
		if(this.priestGroup.numPriests == 0)
			return;
		var followerIndex = this.priestGroup.numPriests - 1;
		this.totalFollowers = this.followersNeededForEachLevel[followerIndex] - (this.priestGroup.numPriests * 10);
		this.checkFollowerCount();
	},
	onFollowersGained: function(followerCount){
		// Add a bit more followers based on the combo
		followerCount = followerCount + this.game.math.roundTo(this.combo / followerCount, 0);
		this.totalFollowers += followerCount;
		this.checkFollowerCount();
	},
	onFollowersLost: function(followerCount){
		this.totalFollowers -= followerCount;
		this.checkFollowerCount();
		this.combo = 0;
	},
	checkFollowerCount: function(){
		if(this.totalFollowers < 0)
			this.totalFollowers = 0;
		// Checks the current amount of followers and adjusts the amount of priests and the gauge.
		for(var i = 1; i <= this.followersNeededForEachLevel.length; i++)
		{
			var numFollowersNeeded = this.followersNeededForEachLevel[i-1];
			if(this.totalFollowers > numFollowersNeeded && this.priestGroup.numPriests <= i)
				this.priestGroup.addPriest();
			else if(this.totalFollowers < numFollowersNeeded && this.priestGroup.numPriests > i)
				this.priestGroup.killLeader();
		}
		this.followersGauge.width = (this.totalFollowers / this.followersNeeded) * this.gaugeWidth;
	}
}