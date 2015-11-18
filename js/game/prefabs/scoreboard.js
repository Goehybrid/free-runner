var Scoreboard = function(game){
   Phaser.Group.call(this, game);
}

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score){
   var bmd, background, gameOverText, scoreText, highScoreText, newHighScoreText, startText;

   // Bitmap data
   bmd = this.game.add.bitmapData(this.game.width,this.game.height);
   bmd.ctx.fillStyle = "black";
   bmd.ctx.fillRect(0,0,this.game.width,this.game.height);

   background = this.game.add.sprite(0,0,bmd);
   background.alpha = 0.5;

   // adding background to scoreboard
   this.add(background);

   // setting the new high score
   var isNewHighScore = false;
   var highscore = localStorage.getItem('highscore');
   if(!highscore || highscore < score){
      isNewHighScore = true;
      highscore = score;
      localStorage.setItem('highscore',highscore);
   }

   // scoreboard design
   this.y = this.game.height;

   gameOverText = this.game.add.bitmapText(0,100,'minecraftia','Crashed', 36);
   gameOverText.x = this.game.width/2 - (gameOverText.textWidth/2);
   this.add(gameOverText);

   scoreText = this.game.add.bitmapText(0,200,'minecraftia','Your Score: '+score,24);
   scoreText.x = this.game.width/2 - (scoreText.textWidth/2);
   this.add(scoreText);

   highScoreText = this.game.add.bitmapText(0,250,'minecraftia','High Score: '+highscore,24);
   highScoreText.x = this.game.width/2 - (highScoreText.textWidth/2);
   this.add(highScoreText);

   startText = this.game.add.bitmapText(0,300,'minecraftia', 'Tap to play again!', 16);
   startText.x = this.game.width/2 - (startText.textWidth/2);
   this.add(startText);

   if(isNewHighScore){
      newHighScoreText = this.game.add.bitmapText(0,100,'minecraftia', 'New High Score!', 12);
      newHighScoreText.tint = 0x43bef7;
      newHighScoreText.x = gameOverText.x + gameOverText.textWidth + 40;
      newHighScoreText.angle = 45;
      this.add(newHighScoreText);
   }

   this.game.add.tween(this).to({y:0}, 1000, Phaser.Easing.Bounce.Out, true);

   this.game.input.onDown.addOnce(this.restart, this);
};

Scoreboard.prototype.restart = function(){
   this.game.state.start('Game',true,false);
}
