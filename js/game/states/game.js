FreeRunner.Game = function () {
   this.playerMinAngle = -20;
   this.playerMaxAngle = 20;

   this.coinRate = 1000; // appear every second
   this.coinTimer = 0; // check every game loop if the coin was created

   this.enemyRate = 500;
   this.enemyTimer = 0;

   this.score = 0;
   this.previousCoinType = null;

   this.coinSpawnX = null;
   this.coinSpacingX = 10;
   this.coinSpacingY = 10;

	// the threshold the play has to reach to speed up scrolling speed
	this.currentThreshold = 10;
	this.backgroundScrollSpeed = -100;
	this.groundScrollSpeed = -400;
	this.enemyVelocity = -400;
	this.coinVelocity = -400;
};

FreeRunner.Game.prototype = {

   create: function () {

		this.game.world.bounds = new Phaser.Rectangle(0,0, this.game.width + 300, this.game.height);
      this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
      this.background.autoScroll(this.backgroundScrollSpeed, 0);

      this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
      this.ground.autoScroll(this.groundScrollSpeed, 0);

      // PLAYER
      this.player = this.add.sprite(100, this.game.height / 2, 'player');
      this.player.anchor.setTo(0.5);
      this.player.scale.setTo(1.5);

      this.player.animations.add('fly', [0, 1, 2, 3, 2, 1]);
      this.player.animations.play('fly', 8, true);

      // PHYSICS SETUP
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 600;

      // GROUND PHYSICS
      this.game.physics.arcade.enableBody(this.ground);
      this.ground.body.allowGravity = false;
      this.ground.body.immovable = true;

      // PLAYER PHYSICS
      this.game.physics.arcade.enableBody(this.player);
      this.player.body.collideWorldBounds = true;
      this.player.body.bounce.set(0.25);

      // COINS GROUP
      this.coins = this.game.add.group();

      // ENEMIES GROUP
      this.enemies = this.game.add.group();

      // SCORE TEXT
      this.scoreText = this.game.add.bitmapText(10,10, 'minecraftia', 'Score: 0', 24);

		// FPS
		this.fps = this.game.add.bitmapText(10,60,'minecraftia','',24);

      // SOUNDS
      this.rocketSound = this.game.add.audio('rocket');
		this.rocketSound.volume = 1.5;

      this.coinSound = this.game.add.audio('coin');

      this.deathSound = this.game.add.audio('death');

      this.gameMusic = this.game.add.audio('gameMusic');
      this.gameMusic.play('',0,true);
		this.gameMusic.volume = 0.2;

      // SETTING THE COIN SPAWNING POINT
      this.coinSpawnX = this.game.width + 64;
   },

   update: function () {
      if (this.game.input.activePointer.isDown) {
         this.player.body.velocity.y -= 25;
         if(!this.rocketSound.isPlaying){
            this.rocketSound.play('',0,true);
         }
      } else {
         this.rocketSound.stop();
      }

      // PLAYER ANGLE
      if (this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown) {
         if (this.player.angle > 0) {
            this.player.angle = 0;
         }

         if (this.player.angle > this.playerMinAngle) {
            this.player.angle -= 0.5;
         }
      } else if (this.player.body.velocity.y >= 0 && !this.game.input.activePointer.isDown) {
         if (this.player.angle < this.playerMaxAngle) {
            this.player.angle += 0.5;
         }
      }

      // COINS
      if (this.coinTimer < this.game.time.now) {
         this.generateCoins();
         this.coinTimer = this.game.time.now + this.coinRate;
      }

      // ENEMIES
      if (this.enemyTimer < this.game.time.now) {
         this.createEnemy();
         this.enemyTimer = this.game.time.now + this.enemyRate;
      }

      // COLLISIONS
      this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);

      // OVERLAPING COINS
      this.game.physics.arcade.overlap(this.player, this.coins, this.coinHit, null, this);

      // OVERLAPING ENEMIES
      this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);

		// CHECKING IF WE REACHED THE THRESHOLD
		if(this.score >= this.currentThreshold){
			// increase the scroll speed
			this.currentThreshold += 10;
			this.backgroundScrollSpeed -= 50;
			this.groundScrollSpeed -= 50;

			this.increaseScrollSpeed(this.backgroundScrollSpeed,this.groundScrollSpeed);
			this.increaseEnemiesSpeed();
			this.increaseCoinsSpeed();

			console.log("Background: ", this.backgroundScrollSpeed, "; Ground: ", this.groundScrollSpeed, "; Enemies: ", this.enemyVelocity, "; Coins: ", this.coinVelocity)
		}

		this.displayFPS();
   },
   createCoin: function () {
      // SET COORDINATES
      var x = this.game.width;
      // RANDOM NUMBER FOR HEIGHT < DEPENDS ON THE HEIGHT OF THE GROUND
      var y = this.game.rnd.integerInRange(20, this.game.world.height - 255);
      // CHECK FOR RECYCLING
      var coin = this.coins.getFirstExists(false);
      if (!coin) {
         coin = new Coin(this.game, 0, 0, "coins",this.coinVelocity);
         this.coins.add(coin);
      }
      // RESET THE COIN
      coin.reset(x, y);
      coin.revive();
      return coin;
   },

   generateCoins: function(){
      if(!this.previousCoinType || this.previousCoinType < 3){
         var coinType = this.game.rnd.integer() % 5;
         switch(coinType){
            case 0:
               // no coins generated
               break;
            case 1:
            case 2:
               // if the type is 1 or 2, create a single coin
               this.createCoin();
               break;
            case 3:
               // create a small group of coins
               this.createCoinGroup(this.game.rnd.integerInRange(1,2),2);
               break;
            case 4:
               // create a large coin group
               this.createCoinGroup(this.game.rnd.integerInRange(2,6),this.game.rnd.integerInRange(2,6));
               break;
            default:
               // if case of error, set the previousCoinType to 0 and do nothing
               this.previousCoinType = 0;
               break;
         }

         this.previousCoinType = coinType;
      } else {
         if(this.previousCoinType === 4){
            // the previous coin type was a large group, please skip
            this.previousCoinType = 3;
         } else {
            this.previousCoinType = 0;
         }
      }
   },

   createCoinGroup: function(columns, rows){
      // create 4 coins in a group
      var coinSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - this.ground.height - 40);
      var coinRowCounter = 0;
      var coinColumnCounter = 0;
      var coin;
      for(var i = 0; i < columns * rows; i++){
         coin = this.createCoin(this.spawnX, coinSpawnY, this.coinVelocity);
         coin.x = coin.x + (coinColumnCounter * coin.width) + (coinColumnCounter * this.coinSpacingX);
         coin.y = coinSpawnY + (coinRowCounter * coin.height) + (coinRowCounter * this.coinSpacingY);
         coinColumnCounter++;
         if(i+1 >= columns && (i+1) % columns === 0){
            coinRowCounter++;
            coinColumnCounter = 0;
         }
      }
   },

   createEnemy: function () {
      // SET COORDINATES
      var x = this.game.width;
      // RANDOM NUMBER FOR HEIGHT< DEPENDS ON THE HEIGHT OF THE GROUND
      var y = this.game.rnd.integerInRange(20, this.game.world.height - this.ground.height);
      // CHECK FOR RECYCLING
      var enemy = this.enemies.getFirstExists(false);

      if (!enemy) {
         enemy = new Enemy(this.game, 0, 0, 'ufo', this.enemyVelocity);
         this.enemies.add(enemy);
      }

      // RESET THE ENEMIE
      enemy.reset(x, y);
      enemy.revive();

   },

   groundHit: function (player, ground) {
      player.kill();
      this.ground.stopScroll();
      this.background.stopScroll();
      this.rocketSound.stop();
      this.deathSound.play();

		// EXPLOSION
      var explosion = this.game.add.sprite(player.body.x,player.body.y,"explosion");
		explosion.anchor.setTo(0,0.25);
		explosion.scale.setTo(6);
		explosion.animations.add("explode",[0,1,2,3,4,5],false);
      explosion.animations.play("explode").delay = 100;


      // stop enemies from moving
      this.enemies.setAll('body.velocity.x',0);
      this.coins.setAll('body.velocity.x',0);

      // stop generating enemies
      this.enemyTimer = Number.MAX_VALUE;

      // stop generating coins
      this.coinTimer = Number.MAX_VALUE;

      var scoreboard = new Scoreboard(this.game);
      scoreboard.show(this.score);
   },

   coinHit: function(player, coin){
      this.score++;
      coin.kill();
      this.coinSound.play();

      var dummyCoin = new Coin(this.game,coin.x,coin.y, -400);
      this.game.add.existing(dummyCoin);
      dummyCoin.animations.play('spin',40,true);

      var scoreTween = this.game.add.tween(dummyCoin).to({x:50,y:50},300, Phaser.Easing.Linear.NONE,true);
      scoreTween.onComplete.add(function(){
         dummyCoin.destroy();
         this.scoreText.text = 'Score: ' + this.score;
      },this);

   },

   enemyHit: function(player, enemy){
      player.kill();
      enemy.kill();
      this.rocketSound.stop();
      this.deathSound.play();

		// EXPLOSION
      var explosion = this.game.add.sprite(player.body.x,player.body.y,"explosion");
		explosion.anchor.setTo(0,0.5);
		explosion.scale.setTo(6);
		explosion.animations.add("explode",[0,1,2,3,4,5],false);
      explosion.animations.play("explode").delay = 100;

      this.ground.stopScroll();
      this.background.stopScroll();

      // stop enemies from moving
      this.enemies.setAll('body.velocity.x',0);
      this.coins.setAll('body.velocity.x',0);

      // stop generating enemies
      this.enemyTimer = Number.MAX_VALUE;

      // stop generating coins
      this.coinTimer = Number.MAX_VALUE;

      var scoreboard = new Scoreboard(this.game);
      scoreboard.show(this.score);
   },

	increaseScrollSpeed: function(backgroundScroll,groundScroll){
		this.background.autoScroll(backgroundScroll,0);
		this.ground.autoScroll(groundScroll,0);
	},

	increaseEnemiesSpeed:function(){
		this.enemyVelocity -= 75;
	},

	increaseCoinsSpeed: function(){
		this.coinVelocity -= 75;
		// changing the speed of already existing coins
		for(var i=0; i < this.coins.children.lenght;i++){
			this.coins[i].body.velocity.x = this.coinVelocity;
		}
	},

	displayFPS: function(){
		this.fps.setText("FPS: " + this.game.time.fps);
	},

   shutdown: function() {
      this.coins.destroy();
      this.enemies.destroy();
      this.score = 0;
      this.coinTimer = 0;
      this.enemyTimer = 0;

		this.backgroundScrollSpeed = -400;
		this.groundScrollSpeed = -100;

		this.enemyVelocity = -400;
		this.coinVelocity = -400;
   }
}
