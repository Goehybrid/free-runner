// class that holds the behavior of the SCOREBOARD objects
var SCOREBOARD = function(game){
	// calling the Phaser.Group superclass
   Phaser.Group.call(this, game);
}

// Extending prototype of Phaser.Group class
SCOREBOARD.prototype = Object.create(Phaser.Group.prototype);
// Specifying the constructor
SCOREBOARD.prototype.constructor = SCOREBOARD;
// Custom method for showing the scoreboard on the screen
SCOREBOARD.prototype.show = function(score){
   var bmd, background, gameOverText, scoreText, highScoreText, newHighScoreText, startText;
   // Adding a half-transparent layer on the screen --> (width, height)
	// P.S. bitmapData is an extended canvas
   bmd = this.game.add.bitmapData(this.game.width,this.game.height);
   bmd.ctx.fillStyle = "black";
   bmd.ctx.fillRect(0,0,this.game.width,this.game.height);
   background = this.game.add.sprite(0,0,bmd);
   background.alpha = 0.5;
   this.add(background);

   // Checking for new high score
   var isNewHighScore = false;
	// Using browser's local storage to store score
   var highscore = localStorage.getItem('highscore');
   if((!highscore || highscore < score) && score !== 0){
		// Setting the new high score
      isNewHighScore = true;
      highscore = score;
      localStorage.setItem('highscore',highscore);
   }

   // Designing the scoreboard
   this.y = this.game.height;
	// Adding the game over text
   gameOverText = this.game.add.bitmapText(0,100,'minecraftia','Game over!', 36);
   gameOverText.x = this.game.width/2 - (gameOverText.textWidth/2);
   this.add(gameOverText);

	// Adding the score text
   scoreText = this.game.add.bitmapText(0,200,'minecraftia','Your Score: '+score,24);
   scoreText.x = this.game.width/2 - (scoreText.textWidth/2);
   this.add(scoreText);

	// Adding the current high score text
   highScoreText = this.game.add.bitmapText(0,250,'minecraftia','High Score: '+highscore,24);
   highScoreText.x = this.game.width/2 - (highScoreText.textWidth/2);
   this.add(highScoreText);

	// Adding the prompt text
   startText = this.game.add.bitmapText(0,300,'minecraftia', 'Tap to play again!', 16);
   startText.x = this.game.width/2 - (startText.textWidth/2);
   this.add(startText);

	// The new high score indicator
   if(isNewHighScore){
      newHighScoreText = this.game.add.bitmapText(0,100,'minecraftia', 'New High Score!', 12);
      newHighScoreText.tint = 0x43bef7;
      newHighScoreText.x = gameOverText.x + gameOverText.textWidth + 40;
      newHighScoreText.angle = 45;
		newHighScoreText.anchor.setTo(0.5);
      this.add(newHighScoreText);
		this.game.add.tween(newHighScoreText.scale).to({x: 0.7, y: 0.7}, 400, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
   }

   this.game.add.tween(this).to({y:0}, 1000, Phaser.Easing.Bounce.Out, true);

	// Specifying the method to run after clicking the mouse button
	// This is executed only once
   this.game.input.onDown.addOnce(this.restart, this);
};

// Custom method for restarting the Game state
SCOREBOARD.prototype.restart = function(){
	// Strating the Game state --> (key, cler world, clear cache)
   this.game.state.start('Game',true,false);
}
