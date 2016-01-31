var GameState = function(game){
};
 
GameState.prototype = {
	/* State methods */
	create: function(){
		this.game.bg = this.game.add.sprite(0, 0, 'game_bg');
        this.game.clouds = new CloudGroup(this.game);
		
		this.bg = this.game.add.sprite(0, 0, 'volcano');
		this.bg.y = 600;

		this.smoke = this.game.add.sprite(0, 0, 'smoke');
		this.smoke.alpha = 0;

		volcanoEntranceTween = this.game.add.tween(this.bg).to({y:-25}, 1500, Phaser.Easing.Linear.None, true);
		volcanoEntranceTween.onComplete.add(function() {
			volcanoBounceTween = this.game.add.tween(this.bg).to({y:0}, 1000, Phaser.Easing.Bounce.Out, true, 0);
			volcanoBounceTween.onComplete.add(function(){
				this.smoke.animations.add('smokey', [0,1,2,3,4,5], 6, true);
		    	this.smoke.animations.play('smokey');
		    	this.smoke.x = 165;
		    	this.smoke.y = -28;
		    	this.smoke.scale.y = 1.5;
		    	smokeEntranceTween = this.game.add.tween(this.smoke).to({alpha:1}, 1000, Phaser.Easing.Circular.InOut, true);
		    	smokeEntranceTween.onComplete.add(function() {
		    		this.smoke.alpha = 1;
		    		this.game.add.tween(this.smoke).to({alpha:.5}, 2000, Phaser.Easing.Circular.InOut, true).yoyo(true,-1)
		    	}, this);
			}, this);
		}, this);		

    	this.game.followerNoiseEnabled = true;

        var initialPopulation = 300;
        this.followers = new Array(300);
		for(var i = 0; i < initialPopulation; i++)
		{
            var col = i % 15;
            var row = Math.floor(i / 15);
            var follower = new Worshipper(this.game, 450 + (16 * col) + 8 *(row % 2), 350 + (10 * row));
            this.game.world.add(follower);
            var newCol = row;
            var newRow = col;
            this.followers[newRow * 20 + newCol] = follower;
		}
        this.leftFollowerInd = 0; // every follower with index lower than this has gone to the volcano
        this.rightFollowerInd = initialPopulation - 1; // every follower with index greater than this has walked away
		this.introTime = 3;
		this.introText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Get ready!', {font: 'Consolas', fontSize: 72});
		this.introText.anchor.setTo(0.5, 0.5);
		this.introTimer = this.game.time.create(true);
		this.introTimer.loop(Phaser.Timer.SECOND * 1, this.updateIntroText, this);
		this.introTimer.start();

		// The group for the priests
		this.priestGroup = this.game.world.add(new PriestGroup(this.game));
		this.priestGroup.gainFollowers.add(this.onFollowersGained, this);
		this.priestGroup.onFailedChant.add(this.onFailedChant, this);
		this.priestGroup.onSuccessfulInput.add(this.onSuccessfulInput, this);
		this.priestGroup.onPriestAdded.add(this.onPriestAdded, this);
		this.priestGroup.onPriestLost.add(this.onPriestLost, this);
		this.priestGroup.onFailedInput.add(this.onFailedInput, this);
		this.priestGroup.x = 70;
		this.priestGroup.y = this.game.world.height - 180;
		this.lastSuccessfulPriest = null;

		this.amountNeededForNextLevel = 0;
		this.followersGainedThisLevel = 0;
		this.defectorsGainedLocally = 0;

		// Follower gauge
		this.gaugeWidth = 625;
		this.gaugeX = 10; //(this.game.world.width / 2) - (this.gaugeWidth / 2);
		this.gaugeH = 16;

		var topGaugeY = this.game.world.height - 40;
		var bottomGaugeY = topGaugeY + this.gaugeH;

		//BG for the bars
	    this.progressBarBG = this.game.add.graphics(this.gaugeX, topGaugeY);
	    this.progressBarBG.beginFill(0xcccccc);
	    this.progressBarBG.drawRect(0, 0, this.gaugeWidth, this.gaugeH * 2);
	    this.progressBarBG.endFill();
	    // Top "good" bar
	    this.levelUpProgressBar = this.game.add.graphics(this.gaugeX, topGaugeY);
	    this.levelUpProgressBar.beginFill(0x00FF00);
	    this.levelUpProgressBar.drawRect(0, 0, 1, this.gaugeH);
	    this.levelUpProgressBar.endFill();
	    // Bottom "bad" bar
	    this.levelDownProgressBar = this.game.add.graphics(this.gaugeX, bottomGaugeY);
	    this.levelDownProgressBar.beginFill(0xFF0000);
	    this.levelDownProgressBar.drawRect(0, 0, 1, this.gaugeH);
	    this.levelDownProgressBar.endFill();
	    //this.levelDownProgressBar.angle = 180;
		// Outlines for both bars
		this.followersGaugeOutline = this.game.add.graphics(this.gaugeX, topGaugeY);
	    this.followersGaugeOutline.lineStyle(2, 0x000000, 1);
	    this.followersGaugeOutline.drawRect(0, 0, this.gaugeWidth, this.gaugeH * 2);
	    this.followersGaugeOutline.moveTo(0, this.gaugeH);
	    this.followersGaugeOutline.lineTo(this.gaugeWidth, this.gaugeH);

	    this.comboText = this.game.add.text(this.gaugeX + this.gaugeWidth - 70, topGaugeY, 'Priest up!', {font: 'Consolas', fontSize: 12, fill: "#000000"});
	    this.comboText = this.game.add.text(this.gaugeX + this.gaugeWidth - 95, bottomGaugeY, 'Priest down :(', {font: 'Consolas', fontSize: 12, fill: "#000000"});

	    // Audio
	    this.levelUp = this.game.add.audio('level_up');
	    this.levelDown = this.game.add.audio('level_down');

		this.elapsedSinceTime = this.game.time.now;

		this.comboText = this.game.add.text(660, this.game.world.height - 30, 'Combo: 0', {font: 'Consolas', fontSize: 22, fill: "#FFFFFF"});
		this.combo = 0;
		this.comboText.visible = false;
		this.comboFloat = this.game.add.text(0, 0, '25x', {font: 'Consolas', fontSize: 22, fill: "#00FF00"});
		this.comboFloat.alpha = 0;

		this.populationText = this.game.add.text(15, 15, 'Total island population: ' + this.game.gameManager.totalPopulation, {font: 'Consolas', fontSize:22});
        
	    this.gameStartTimer = this.game.time.create(true);
	    this.gameStartTimer.add(Phaser.Timer.SECOND * 4, this.beginGame, this);
	    this.gameStartTimer.start();
	},
	update: function(){
	},
	render: function(){
		//this.game.debug.text("Time: " + (this.game.time.now - this.elapsedSinceTime), 32, this.game.world.height - 32);
	},
	shutdown: function(){
		this.priestGroup.onPriestAdded.remove(this.onPriestAdded, this);
		this.priestGroup.onPriestLost.remove(this.onPriestLost, this);
		this.priestGroup.gainFollowers.remove(this.onFollowersGained, this);
		this.priestGroup.onFailedChant.remove(this.onFailedChant, this);
		this.priestGroup.onSuccessfulInput.remove(this.onSuccessfulInput, this);
		this.priestGroup.onFailedInput.remove(this.onFailedInput, this);
	},
	beginGame: function(){
	    this.game.audioManager.playAllTracks();
		this.introTimer.destroy();
		this.priestGroup.addPriest(0);
	    // Listen for the input on the keys
	    this.game.input.keyboard.addCallbacks(this, null, null, this.onKeyPress);

	    // Since arrow keys are not printable, we must check for those separately
	    this.interactionKeys = this.game.input.keyboard.addKeys({ 'up': Phaser.KeyCode.UP, 'down': Phaser.KeyCode.DOWN, 'left': Phaser.KeyCode.LEFT, 'right': Phaser.KeyCode.RIGHT });
	    this.interactionKeys.up.onDown.add(this.onDirectionKeyPress, this);
	    this.interactionKeys.down.onDown.add(this.onDirectionKeyPress, this);
	    this.interactionKeys.left.onDown.add(this.onDirectionKeyPress, this);
	    this.interactionKeys.right.onDown.add(this.onDirectionKeyPress, this);
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
		// Set the last priest as the last one to hit a success
		this.lastSuccessfulPriest = priest;
	},
	onFailedInput: function(){
		this.defectorsGainedLocally += this.game.gameManager.followersPenalty;
		this.game.gameManager.totalDefectors += this.game.gameManager.followersPenalty;
		this.game.gameManager.totalPopulation -= this.game.gameManager.followersPenalty;
        if (this.leftFollowerInd <= this.rightFollowerInd){
            for (i = 0; i < this.game.gameManager.followersPenalty; i++){
                this.followers[this.rightFollowerInd].leave();
                this.rightFollowerInd--;
            }
        }
		this.checkFollowerCount();
	},
	onPriestAdded: function(priest){
		// Reset the amount needed for the next level
		this.amountNeededForNextLevel = this.game.gameManager.followersNeededForEachLevel[this.priestGroup.numPriests - 1];
		this.followersGainedThisLevel = 0;
		this.checkFollowerCount();
	},
	onPriestLost: function(){
		if(this.priestGroup.numPriests == 0)
		{
			this.checkFollowerCount();
			return;
		}
		// Reset the amount needed for the delevel progress bar
		// First, get the percentage of what has already progressed.
		// We reward the player with the majority percentage of what was either progressed or not progressed.
		var percentRemaining = this.followersGainedThisLevel / this.amountNeededForNextLevel;
		if(percentRemaining < 0.5 && percentRemaining > 0)
			percentRemaining = 1 - percentRemaining;
		this.amountNeededForNextLevel = this.game.gameManager.followersNeededForEachLevel[this.priestGroup.numPriests - 1];
		this.followersGainedThisLevel = this.game.math.roundTo(this.amountNeededForNextLevel * percentRemaining, 0);
		this.combo = 0;
		this.checkFollowerCount();
	},
	onFollowersGained: function(followerCount){
		// Add a bit more followers based on the combo
		followerCount = followerCount + this.game.math.roundTo(followerCount * this.combo / 10, 0);
        if (this.leftFollowerInd <= this.rightFollowerInd){
            for (i = 0; i < followerCount; i++){
                this.followers[this.leftFollowerInd].sacrifice();
                this.leftFollowerInd++;
            }
        }
		this.game.gameManager.totalFollowers += followerCount;
		this.game.gameManager.totalPopulation -= followerCount;
		this.followersGainedThisLevel += followerCount;
		this.checkFollowerCount();
	},
	onFailedChant: function(){
		this.defectorsGainedLocally += this.game.gameManager.failedChantPenalty;
		this.game.gameManager.totalDefectors += this.game.gameManager.failedChantPenalty;
        if (this.leftFollowerInd <= this.rightFollowerInd){
            for (i = 0; i < this.game.gameManager.failedChantPenalty; i++){
                this.followers[this.rightFollowerInd].leave();
                this.rightFollowerInd--;
            }
        }
		// Subtract from the total population
		this.game.gameManager.totalPopulation -= this.game.gameManager.failedChantPenalty;
		this.combo = 0;
		this.checkFollowerCount();
	},
	checkFollowerCount: function(){
		if(this.followersGainedThisLevel >= this.amountNeededForNextLevel)
		{
			this.priestGroup.addPriest();
			this.levelUp.play();
		}
		this.levelUpProgressBar.width = (this.followersGainedThisLevel / this.amountNeededForNextLevel) * this.gaugeWidth;
		if(this.defectorsGainedLocally >= this.game.gameManager.followerPenaltyThreshold)
		{
			this.defectorsGainedLocally = 0;
			this.priestGroup.killPriest();
			this.levelDown.play();
		}
		this.levelDownProgressBar.width = (this.defectorsGainedLocally / this.game.gameManager.followerPenaltyThreshold) * this.gaugeWidth;
		// End condition is running out of islanders or priests
		if(this.game.gameManager.totalPopulation <= 0)
		{
			this.game.state.start("GameOver", true, false, "The island has ran out of inhabitants!");
			return;
		}
		else if(this.priestGroup.numPriests == 0)
		{
			this.game.state.start("GameOver", true, false, "All the priests have been fired!");
			return;
		}
		this.populationText.text = "Total island population: " + this.game.gameManager.totalPopulation + "\nFollowers: " + this.game.gameManager.totalFollowers;
	}
}