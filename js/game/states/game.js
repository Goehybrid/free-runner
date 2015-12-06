// to-do:
// * play sound when threshold increases
// * refactoring
// * increase enemies and Stars rate

SpaceChase.Game = function () {
   this.playerMinAngle = -23;
   this.playerMaxAngle = 23;
};

SpaceChase.Game.prototype = {

   create: function () {

		this.resetInitialParams();

		// setting the game boundaries
		this.game.world.bounds = new Phaser.Rectangle(0,0, this.game.width + 300, this.game.height);

      this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
      this.background.autoScroll(this.backgroundScrollSpeed, 0);

      this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
      this.ground.autoScroll(this.groundScrollSpeed, 0);

      // PLAYER
      this.player = this.add.sprite(100, this.game.height / 2, 'player');
      this.player.anchor.setTo(0.5);

      this.player.animations.add('fly', [0, 1, 2, 3, 2, 1]);
      this.player.animations.play('fly', 10, true);

      // PHYSICS SETUP
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.arcade.gravity.y = 500;

      // GROUND PHYSICS
      this.game.physics.arcade.enableBody(this.ground);
      this.ground.body.allowGravity = false;
      this.ground.body.immovable = true;

      // PLAYER PHYSICS
      this.game.physics.arcade.enableBody(this.player);
      this.player.body.collideWorldBounds = true;

      // StarS GROUP
      this.stars = this.game.add.group();

      // ENEMIES GROUP
      this.ufos = this.game.add.group();

		// BOSSES GROUP
		this.bosses = this.game.add.group();

		// MISSILES GROUP
		this.missiles = this.game.add.group();


      // SCORE TEXT
      this.scoreText = this.game.add.bitmapText(10,10, 'minecraftia', 'Score: 0', 24);

      // SOUNDS
      this.rocketSound = this.game.add.audio('rocket');


		this.missileSound = this.game.add.audio('missile');

      this.starSound = this.game.add.audio('star');

      this.deathSound = this.game.add.audio('death');

      this.gameMusic = this.game.add.audio('gameMusic');
      this.gameMusic.play('',0,true);
		this.gameMusic.volume = 0.09;

      // SETTING THE Star SPAWNING POINT
      this.starSpawnX = this.game.width + 64;


   },

   update: function () {
		if(!this.gameMusic.isPlaying && this.bossTimer !== Number.MAX_VALUE){
			this.gameMusic.play('',0,true);
			this.gameMusic.volume = 0.09;
		}

      if (this.game.input.activePointer.isDown) {
         this.player.body.velocity.y -= 25;
         if(!this.rocketSound.isPlaying){
            this.rocketSound.play('',0,true);
				this.rocketSound.volume = 1.4;
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

      // StarS
      if (this.starTimer < this.game.time.now) {
         this.generateStars();
         this.starTimer = this.game.time.now + this.starRate;
      }

      // ENEMIES
      if (this.ufoTimer < this.game.time.now) {
         this.createEnemy();
         this.ufoTimer = this.game.time.now + this.ufoRate;
      }

		// BOSS
		if(this.bossTimer < this.game.time.now){
			this.createBoss();
			this.bossTimer = this.game.time.now + this.bossRate;
		}

		// COLLISIONS
      this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);

      // OVERLAPING StarS
      this.game.physics.arcade.overlap(this.player, this.stars, this.starHit, null, this);

      // OVERLAPING ENEMIES
      this.game.physics.arcade.overlap(this.player, this.ufos, this.enemyHit, null, this);
      this.game.physics.arcade.overlap(this.player, this.bosses, this.enemyHit, null, this);
      this.game.physics.arcade.overlap(this.player, this.missiles, this.enemyHit, null, this);

		// CHECKING IF WE REACHED THE THRESHOLD
		if(this.score >= this.currentThreshold){
			// increase the scroll speed
			this.currentThreshold += 10;
			this.backgroundScrollSpeed -= 50;
			this.groundScrollSpeed -= 50;

			this.increaseScrollSpeed(this.backgroundScrollSpeed,this.groundScrollSpeed);
			this.enhanceEnemies();
			this.enhanceStars();

			console.log("Background: ", this.backgroundScrollSpeed, "; Ground: ", this.groundScrollSpeed, "; Enemies: ", this.ufoVelocity, "; Stars: ", this.starVelocity)
		}

   },
   createStar: function () {
      // SET COORDINATES
      var x = this.game.width;
      // RANDOM NUMBER FOR HEIGHT < DEPENDS ON THE HEIGHT OF THE GROUND
      var y = this.game.rnd.integerInRange(20, this.game.world.height - 255);
      // CHECK FOR RECYCLING
      var Star = this.stars.getFirstExists(false);
      if (!Star) {
         Star = new STAR(this.game, 0, 0, "stars",this.starVelocity);
         this.stars.add(Star);
      }
      // RESET THE Star
      Star.reset(x, y);
      Star.revive();
      return Star;
   },

   generateStars: function(){
      if(!this.previousStarType || this.previousStarType < 3){
         var starType = this.game.rnd.integer() % 5;
         switch(starType){
            case 0:
               this.createStar();
               break;
            case 1:
            case 2:
               // if the type is 1 or 2, create a single Star
                this.createStarGroup(this.game.rnd.integerInRange(2,3),this.game.rnd.integerInRange(2,4));
               break;
            case 3:
               // create a small group of Stars
               this.createStarGroup(this.game.rnd.integerInRange(2,3),2);
               break;
            case 4:
               // create a large Star group
               this.createStarGroup(this.game.rnd.integerInRange(2,6),this.game.rnd.integerInRange(2,6));
               break;
            default:
               // if case of error, set the previousStarType to 0 and do nothing
               this.previousStarType = 0;
               break;
         }

         this.previousStarType = starType;
      } else {
         if(this.previousStarType === 4){
            // the previous Star type was a large group, please skip
            this.previousStarType = 3;
         } else {
            this.previousStarType = 0;
         }
      }
   },

   createStarGroup: function(columns, rows){
      // create 4 Stars in a group
      var StarSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - this.ground.height - 240);
      var StarRowCounter = 0;
      var StarColumnCounter = 0;
      var Star;
      for(var i = 0; i < columns * rows; i++){
         Star = this.createStar(this.spawnX, StarSpawnY, this.starVelocity);
         Star.x = Star.x + (StarColumnCounter * Star.width) + (StarColumnCounter * this.starSpacingX);
         Star.y = StarSpawnY + (StarRowCounter * Star.height) + (StarRowCounter * this.starSpacingY);
         StarColumnCounter++;
         if(i+1 >= columns && (i+1) % columns === 0){
            StarRowCounter++;
            StarColumnCounter = 0;
         }
      }
   },

   createEnemy: function () {

		var randomEnemyNumber = this.game.rnd.integerInRange(1,4);
		for(var i = 0; i < randomEnemyNumber;i++){
			// SET COORDINATES
			var x = this.game.width;
			// RANDOM NUMBER FOR HEIGHT< DEPENDS ON THE HEIGHT OF THE GROUND
			var y = this.game.rnd.integerInRange(20, this.game.world.height - this.ground.height);
			// CHECK FOR RECYCLING
			var ufo = this.ufos.getFirstExists(false);

			if (!ufo) {
				ufo = new UFO(this.game, 0, 0, 'ufo', this.ufoVelocity);
				this.ufos.add(ufo);
			}

			// RESET THE ENEMIE
			ufo.reset(x, y);
			ufo.revive();
		}
		console.log("Number of ufos: ", this.ufos.children.length)
   },

	createBoss: function(){
			var self = this;

			var x = this.game.width;
		   var y = this.player.body.y;
			//var y = this.game.rnd.integerInRange(20, this.game.world.height - this.ground.height);
			var boss = this.bosses.getFirstExists(false);

			// the following code can be refactored
			if(!boss){
				boss = new BOSS(this.game,0,0,'boss', this.bossVelocity);
				boss.missileTimer = this.missileTimer;
				this.bosses.add(boss);
			}

			boss.update = function(){
				if(boss.missileTimer < self.game.time.now && self.missileTimer !== Number.MAX_VALUE && (boss.body.x - self.player.body.x) > 200){
					self.createMissile(boss);
					boss.missileTimer = self.game.time.now + self.missileRate;
				}
			}

			boss.reset(x,y);
			boss.revive();
			console.log("Number of bosses: ", this.bosses.children.length)
	},

	createMissile: function(boss){
		// spawn missiles from the first existing boss position
		var x = boss.body.x;
		var y = boss.body.y + boss.body.height / 2;
		// creating an actual missile
		var missile = this.missiles.getFirstExists(false);

		if(!missile){
			missile = new MISSILE(this.game,0,0,'missile',this.missileVelocity);
			this.missiles.add(missile);
		}

		missile.reset(x,y);
		this.missileSound.play('',0,true);
		this.missileSound.volume = 0.04;
		missile.revive();
		console.log("Number of missiles: ", this.missiles.children.length)
	},

   groundHit: function (player) {
		var player = player;
      player.kill();

      this.rocketSound.stop();
      this.deathSound.play();
		this.gameMusic.stop();

		// play explosion animation
		this.showExplosion(player);

      // stop all sprites
      this.stopSprites();

		// show scoreboard
      var scoreboard = new Scoreboard(this.game);
      scoreboard.show(this.score);
   },

   starHit: function(player, Star){
      this.score++;
      Star.kill();
      this.starSound.play();

      var dummyStar = new STAR(this.game,Star.x,Star.y,"stars", -400);
      this.game.add.existing(dummyStar);
      dummyStar.animations.play('spin',40,true);

      var scoreTween = this.game.add.tween(dummyStar).to({x:50,y:50},300, Phaser.Easing.Linear.NONE,true);
      scoreTween.onComplete.add(function(){
         dummyStar.destroy();
         this.scoreText.text = 'Score: ' + this.score;
      },this);

   },

   enemyHit: function(player, enemy){
		var player = player, enemy = enemy;

      player.kill();
      enemy.kill();

      this.rocketSound.stop();
		this.gameMusic.stop();
      this.deathSound.play();

		// EXPLOSION
		this.showExplosion(player);

      // stop all sprites
      this.stopSprites();

      var scoreboard = new Scoreboard(this.game);
      scoreboard.show(this.score);
   },

	increaseScrollSpeed: function(backgroundScroll,groundScroll){
		this.background.autoScroll(backgroundScroll,0);
		this.ground.autoScroll(groundScroll,0);
	},

	enhanceEnemies: function(){
		this.ufoVelocity -= 50;
		this.bossVelocity -= 30;
		this.missileVelocity = this.bossVelocity * 1.9;
	},

	enhanceStars: function(){
		this.starVelocity -= 50;
		// changing the speed of already existing Stars
		for(var i=0; i < this.stars.children.lenght;i++){
			this.stars[i].body.velocity.x = this.starVelocity;
		}
	},

	showExplosion: function(player){
		var explosion = this.game.add.sprite(player.body.x,player.body.y,"explosion");
		explosion.anchor.setTo(0,0.5);
		explosion.scale.setTo(6);
		explosion.animations.add("explode",[0,1,2,3,4,5],false);
      explosion.animations.play("explode").delay = 100;
	},

	stopSprites: function(){
		// stop generating enemies
      this.ufoTimer = Number.MAX_VALUE;
      this.bossTimer = Number.MAX_VALUE;
		this.missileTimer = Number.MAX_VALUE;
		// for each boss disable timer

		// stop generating Stars
      this.starTimer = Number.MAX_VALUE;

		this.ground.stopScroll();
      this.background.stopScroll();

		// set velocity of existing sprites to 0
		this.ufos.setAll('body.velocity.x',0);
      this.bosses.setAll('body.velocity.x',0);
      this.stars.setAll('body.velocity.x',0);
      this.missiles.setAll('body.velocity.x',0);
	},

	resetInitialParams: function(){
		this.currentThreshold = 10;
		this.score = 0;

		this.previousStarType = null;
		this.starSpawnX = null;
		this.starSpacingX = 10;
		this.starSpacingY = 10;
		this.starVelocity = -400;

		this.starRate = 2000; // appear every second
		this.starTimer = 0; // check every game loop if the Star was created

		this.ufoRate = 900;
		this.ufoTimer = 0;

		this.bossRate = 3000;
		this.bossTimer = 0;

		this.missileRate = 900;
		this.missileTimer = 0;

		this.backgroundScrollSpeed = -400;
		this.groundScrollSpeed = -100;

		this.ufoVelocity = -400;
		this.bossVelocity = -275;
		this.missileVelocity = this.bossVelocity * 3;

	},

   shutdown: function() {
      this.stars.destroy();
      this.ufos.destroy();
		this.bosses.destroy();
		this.missiles.destroy();
   }

}
