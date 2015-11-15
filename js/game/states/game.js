FreeRunner.Game = function () {
   this.playerMinAngle = -20;
   this.playerMaxAngle = 20;

   this.coinRate = 1000; // appear every second
   this.coinTimer = 0; // check every game loop if the coin was created

   this.enemyRate = 500;
   this.enemyTimer = 0;

   this.score = 0;
};

FreeRunner.Game.prototype = {

   create: function () {
      this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
      this.background.autoScroll(-100, 0);

      //this.foreground = this.game.add.tileSprite(0, 575, this.game.width, 231, 'foreground');
      //this.foreground.scale.setTo(1.8);
      //this.foreground.autoScroll(-120, 0);

      this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
      this.ground.autoScroll(-400, 0);

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

   },

   update: function () {
      if (this.game.input.activePointer.isDown) {
         this.player.body.velocity.y -= 25;
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
         // A NEW COIN IS CREATED EVERY SECOND
         this.createCoin();
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
   },
   createCoin: function () {
      // SET COORDINATES
      var x = this.game.width;
      // RANDOM NUMBER FOR HEIGHT< DEPENDS ON THE HEIGHT OF THE GROUND
      var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);
      // CHECK FOR RECYCLING
      var coin = this.coins.getFirstExists(false);
      if (!coin) {
         coin = new Coin(this.game, 0, 0);
         this.coins.add(coin);
      }
      // RESET THE COIN
      coin.reset(x, y);
      coin.revive();
   },

   createEnemy: function () {
      // SET COORDINATES
      var x = this.game.width;
      // RANDOM NUMBER FOR HEIGHT< DEPENDS ON THE HEIGHT OF THE GROUND
      var y = this.game.rnd.integerInRange(50, this.game.world.height - this.ground.height);
      // CHECK FOR RECYCLING
      var enemy = this.enemies.getFirstExists(false);
      if (!enemy) {
         enemy = new Enemy(this.game, 0, 0);
         this.enemies.add(enemy);
      }
      // RESET THE COIN
      enemy.reset(x, y);
      enemy.revive();
   },

   groundHit: function (player, ground) {
      player.kill();
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

   coinHit: function(player, coin){
      this.score++;
      coin.kill();
      this.scoreText.text = 'Score: ' + this.score;
   },

   enemyHit: function(player, enemy){
      player.kill();
      enemy.kill();

      this.ground.stopScroll();
      this.background.stopScroll();
      //this.foreground.stopScroll();

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

   shutdown: function() {
      this.coins.destroy();
      this.enemies.destroy();
      this.score = 0;
      this.coinTimer = 0;
      this.enemyTimer = 0;
   }
}
