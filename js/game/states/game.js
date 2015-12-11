// to-do:
// * play sound when threshold increases
// * refactoring
// * increase enemies and Stars rate

//This state is responsible for the main game logic

// Creating a game state
SpaceChase.Game = function () {
	// Specifying the maximum angle the player sprite turn up/down to
   this.playerMinAngle = -23;
   this.playerMaxAngle = 23;
};

// Extending the prototype for the preload state
SpaceChase.Game.prototype = {
	// Adding game assets, plus setting up the game environment
   create: function () {
		// Setting initial parameters for the game objects
		this.resetInitialParams();
		// setting the game boundaries --> (x-coord, y-coord, width, height)
		this.game.world.bounds = new Phaser.Rectangle(0,0, this.game.width + 300, this.game.height);
		// Setting the background of the game --> (x-coord, y-coord, width, height, key)
      this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
		// Setting autoscroll of the background --> (x-scroll speed, y-scroll speed)
      this.background.autoScroll(this.backgroundScrollSpeed, 0);
		// Adding a ground to the game --> (x-coord, y-coord, width, height, key)
      this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
		// Setting autoscroll of the ground --> (x-scroll speed, y-scroll speed)
      this.ground.autoScroll(this.groundScrollSpeed, 0);

      // PLAYER
		// Adding the main player to the game --> (x-coord, y-coord, key)
      this.player = this.add.sprite(100, this.game.height / 2, 'player');
		// Setting the anchor of the player to be in the center of the image
      this.player.anchor.setTo(0.5);
		// Setting up a custom animation --> (key, [frame numbers])
      this.player.animations.add('fly', [0, 1, 2, 3, 2, 1]);
		// Playing the custom animation --> (key, frame rate, loop)
      this.player.animations.play('fly', 10, true);

      // PHYSICS SETUP
		// Setting up the type of physics that is going to be used in the game --> (Physic's type)
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
		// Applying a local gravity to the game
      this.game.physics.arcade.gravity.y = 500;

      // GROUND PHYSICS
		// Creating an Arcade Physics body on the given game object --> (context)
      this.game.physics.arcade.enableBody(this.ground);
		// Do not the ground to be influenced by gravity
      this.ground.body.allowGravity = false;
		// Prevent the ground from moving anywhere
      this.ground.body.immovable = true;

      // PLAYER PHYSICS
		// Creating an Arcade Physics body on the given game object --> (context)
      this.game.physics.arcade.enableBody(this.player);
		// Preventing the player from leaving the world bounds
      this.player.body.collideWorldBounds = true;

      // STARS GROUP
		// Creating a group of stars that will be used for STAR object pooling
      this.stars = this.game.add.group();

      // ENEMIES GROUP
		// Creating a group of ufos that will be used for UFO object pooling
      this.ufos = this.game.add.group();

		// BOSSES GROUP
		// Creating a group of bosses that will be used for BOSS object pooling
		this.bosses = this.game.add.group();

		// MISSILES GROUP
		// Creating a group of missile that will be used for MISSILE object pooling
		this.missiles = this.game.add.group();

      // Adding a score text to the screen --> (x-coord, y-coord, key, value, font-size)
      this.scoreText = this.game.add.bitmapText(10,10, 'minecraftia', 'Score: 0', 24);

      // SOUNDS
		// Adding a sound for the player's engine exhaust --> (key)
      this.rocketSound = this.game.add.audio('rocket');
		// Adding a sound for the missile trail --> (key)
		this.missileSound = this.game.add.audio('missile');
		// Adding a colleced star sound --> (key)
      this.starSound = this.game.add.audio('star');
		// Adding a sound collision occurence --> (key)
      this.deathSound = this.game.add.audio('death');
		// Adding a music for the main game theme --> (key)
      this.gameMusic = this.game.add.audio('gameMusic');
		// PLaying the main theme music right away --> (marker, starting point,volume loop)
      this.gameMusic.play('',0,0.09,true);
      // Setting the stars' default spawing point
      this.starSpawnX = this.game.width + 64;
   },

	// The main game loop
   update: function () {
		// Watching the main player's vertical velocity
		// If the user in pressing the left mouse button
      if (this.game.input.activePointer.isDown) {
			// The player goes upper
         this.player.body.velocity.y -= 25;
			// The engine sound is not playing
         if(!this.rocketSound.isPlaying){
				// Play the rocket's engine sound --> (marker,starting point, loop)
            this.rocketSound.play('',0,1.4,true);
         }
      } else {
			// Otherwise, stop the engine sound
			// P.S. The player will go lower with a help of built-in gravity system
         this.rocketSound.stop();
      }

      // Watching the main player's vertical velocity
		// If player's vertical velocity is less that 0 and the user in holding the mouse button
      if (this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown) {
			// If player's angle is greater that the pre-set minimal angle
         if (this.player.angle > this.playerMinAngle) {
				// Decrease player's angle by 0.5 every tick
            this.player.angle -= 0.5;
         }
      } else if (this.player.body.velocity.y >= 0 && !this.game.input.activePointer.isDown) {
			// Otherwise, increase player's angle by 0.5 every tick
         if (this.player.angle < this.playerMaxAngle) {
            this.player.angle += 0.5;
         }
      }

      // Spawning stars
		// P.S. game.time.now holds time in milliseconds
      if (this.starTimer < this.game.time.now) {
         this.generateStars();
         this.starTimer = this.game.time.now + this.starRate;
      }

      // Spawning ufos
      if (this.ufoTimer < this.game.time.now) {
         this.createUfo();
         this.ufoTimer = this.game.time.now + this.ufoRate;
      }

		// Spawning bosses
		if(this.bossTimer < this.game.time.now){
			this.createBoss();
			this.bossTimer = this.game.time.now + this.bossRate;
		}

		// COLLISIONS
		// Watching for collision between the player and the ground --> (object1, object2, method to fire, process callback, context)
      this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
      // Watching for collision between the player and a star
      this.game.physics.arcade.overlap(this.player, this.stars, this.starHit, null, this);
		// Watching for collision between the player and a ufo
      this.game.physics.arcade.overlap(this.player, this.ufos, this.enemyHit, null, this);
		// Watching for collision between the player and a boss
      this.game.physics.arcade.overlap(this.player, this.bosses, this.enemyHit, null, this);
		// Watching for collision between the player and a missile
      this.game.physics.arcade.overlap(this.player, this.missiles, this.enemyHit, null, this);

		// Checking for score threshold
		if(this.score >= this.currentThreshold){
			// Set a new value to the threshold
			this.currentThreshold += 10;
			// Set a new value to the background speed
			this.backgroundScrollSpeed -= 50;
			// Set a new value to the ground scroll speed
			this.groundScrollSpeed -= 50;
			// Increase ground/background scroll speed --> (new background speed, new ground speed)
			this.increaseScrollSpeed(this.backgroundScrollSpeed,this.groundScrollSpeed);
			// Increase enemies parameters
			this.enhanceEnemies();
			// Increase stars parameters
			this.enhanceStars();

			console.log("Background: ", this.backgroundScrollSpeed, "; Ground: ", this.groundScrollSpeed, "; Enemies: ", this.ufoVelocity, "; Stars: ", this.starVelocity)
		}

   },
	// Createing a new star object
   createStar: function () {
      // Setting the x-coordinate of the spawning position
      var x = this.game.width;
      // Setting the y-coordinate of the spawning position, random number --> (min, max)
      var y = this.game.rnd.integerInRange(20, this.game.world.height - 255);
      // STAR POOLING
		// Get the first object that doesn't exist (went out of the world boundaries)
      var star = this.stars.getFirstExists(false);
		// If there are no recycled stars to use, we create a new one
      if (!star) {
			// Creating a new instance of the STAR class --> (context, x-coord, y-coord, key, custom velocity)
         star = new STAR(this.game, 0, 0, "stars",this.starVelocity);
			// Adding a newly created star object to the group
         this.stars.add(star);
      }
      // Setting the x and y position of the star
      star.reset(x, y);
		// Calling the custom onRevived() method
      star.revive();
      return star;
   },

	// Determining what kind of star group we are going to generate
   generateStars: function(){
      if(!this.previousStarType){
         var starType = this.game.rnd.integer() % 5;
			// Depending on the starType, we create different groups of stars
         switch(starType){
            case 0:
					// Create a single star
               this.createStar();
               break;
            case 1:
            case 2:
               // if the type is 1 or 2, create a single Star
                this.createStarGroup(this.game.rnd.integerInRange(2,3),this.game.rnd.integerInRange(2,3));
               break;
            case 3:
               this.createStarGroup(this.game.rnd.integerInRange(3,4),this.game.rnd.integerInRange(3,4));
               break;
            case 4:
               this.createStarGroup(this.game.rnd.integerInRange(2,6),this.game.rnd.integerInRange(2,6));
               break;
            default:
               // if case of error, set the previousStarType to 0
               this.previousStarType = 0;
               break;
         }
         this.previousStarType = starType;
      } else {
         this.previousStarType = 0;
      }
   },

	// Creating a group of stars that will enter the world together
   createStarGroup: function(columns, rows){
      // Y-coord of spawning --> (min, max)
      var StarSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - this.ground.height - 240);
      var StarRowCounter = 0;
      var StarColumnCounter = 0;
      var Star;
		// Filling rows and columns with stars
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

	// Createing a new ufo object
   createUfo: function () {
		// Generation a group of enemies --> (min,max)
		var randomEnemyNumber = this.game.rnd.integerInRange(1,3);
		for(var i = 0; i < randomEnemyNumber;i++){
			// Setting the x-coordinate of the spawning position
			var x = this.game.width;
			// Setting the y-coordinate of the spawning position, random number --> (min, max)
			var y = this.game.rnd.integerInRange(20, this.game.world.height - this.ground.height);
			// UFO POOLING
			// Get the first display object that doesn't exist (went out of the world boundaries)
			var ufo = this.ufos.getFirstExists(false);
			// If there are no recycled ufo to use, we create a new one
			if (!ufo) {
				// Creating a new instance of the UFO class --> (context, x-coord, y-coord, key, custom velocity)
				ufo = new UFO(this.game, 0, 0, 'ufo', this.ufoVelocity);
				// Adding a newly created ufo object to the group
				this.ufos.add(ufo);
			}

			// Setting the x and y position of the ufo
			ufo.reset(x, y);
			// Calling the custom onRevived() method
			ufo.revive();
		}
		console.log("Number of ufos: ", this.ufos.children.length)
   },

	// Createing a new boss object
	createBoss: function(){
		// Saving the context
		var self = this;
		// Setting the x-coordinate of the spawning position
		var x = this.game.width;
		//var y = this.player.body.y;
		// Setting the y-coordinate of the spawning position, random number --> (min, max)
		var y = this.game.rnd.integerInRange(20, this.game.world.height - this.ground.height);
		// UFO POOLING
		// Get the first display object that doesn't exist (went out of the world boundaries)
		var boss = this.bosses.getFirstExists(false);
		// If there are no recycled boss to use, we create a new one
		if(!boss){
			// Creating a new instance of the BOSS class --> (context, x-coord, y-coord, key, custom velocity)
			boss = new BOSS(this.game,0,0,'boss', this.bossVelocity);
			// Creating a new property on the boss object
			boss.missileTimer = this.missileTimer;
			// Adding a newly created object to the group
			this.bosses.add(boss);
		}
		// Inner update loop, runs 60 time every second
		boss.update = function(){
			// Creating a missile
			if(boss.missileTimer < self.game.time.now && self.missileTimer !== Number.MAX_VALUE && (boss.body.x - self.player.body.x) > 200){
				self.createMissile(boss);
				boss.missileTimer = self.game.time.now + self.missileRate;
			}
		}
		// Setting the x and y position of the boss
		boss.reset(x,y);
		// Calling the custom onRevived() method
		boss.revive();
	},

	createMissile: function(boss){
		// The x position depends on the x position of the boss the missile spawn is attached to
		var x = boss.body.x;
		// The y position depends on the y position of the boss the missile spawn is attached to
		var y = boss.body.y + boss.body.height / 2;
		// MISSILE POOLING
		// Get the first display object that doesn't exist (went out of the world boundaries)
		var missile = this.missiles.getFirstExists(false);
		// If there are no recycled missile to use, we create a new one
		if(!missile){
			// Creating a new instance of the MISSILE class --> (context, x-coord, y-coord, key, custom velocity)
			missile = new MISSILE(this.game,0,0,'missile',this.missileVelocity);
			// Adding a newly created object to the group
			this.missiles.add(missile);
		}
		// Setting the x and y position of the nissile
		missile.reset(x,y);
		// Playing the missile sound
		this.missileSound.play('', 0, 0.04, false);
		// Calling the custom onRevived() method
		missile.revive();
	},

	// Method for handling the collision with the ground
   groundHit: function (player) {
		var player = player;
		// Killing the player
      player.kill();
      this.rocketSound.stop();
      this.deathSound.play();
		this.gameMusic.stop();

		// Play explosion animation
		this.showExplosion(player);

      // Stop all sprites
      this.stopSprites();

		// Creating an instance of the SCOREBOARD
      var scoreboard = new SCOREBOARD(this.game);
		// Show scoreboard
      scoreboard.show(this.score);
   },
	// Method for handling the collision with a star
   starHit: function(player, star){
		// Increment the score
      this.score++;
		// Kill the star object
      star.kill();
      this.starSound.play();

		// CUSTOM COLLECTED STAR ANIMATION
		// Creating a new instance of the STAR class
      var fakeStar = new STAR(this.game, star.x, star.y, "stars", -400);
		// Creating a game object without adding it yet
      this.game.add.existing(fakeStar);
		// Playing a custom animation
      fakeStar.animations.play('spin',40,true);
		// Adding a tween animation. By the end, a fake star object is destroyed and the score text is updated
      var scoreTween = this.game.add.tween(fakeStar).to({x:50, y:50}, 300, Phaser.Easing.Linear.NONE,true);
		// Adding a callback function that will be executed by the end of animation --> (function, context)
      scoreTween.onComplete.add(function(){
         fakeStar.destroy();
         this.scoreText.text = 'Score: ' + this.score;
      },this);

   },
	// Method for handling the collision with enemies
   enemyHit: function(player, enemy){
		var player = player, enemy = enemy;
		// Killing both objects that participated in collision
      player.kill();
      enemy.kill();

      this.rocketSound.stop();
		this.gameMusic.stop();
      this.deathSound.play();

		// Showing the explosion animation
		this.showExplosion(player);

      // Stop all sprites
      this.stopSprites();

		// Creating a new instance of the SCOREBOARD class
      var scoreboard = new SCOREBOARD(this.game);
		// Showing the scoreboard
      scoreboard.show(this.score);
   },
	// Method for increasing the scroll speed of the ground/background
	increaseScrollSpeed: function(backgroundScroll,groundScroll){
		this.background.autoScroll(backgroundScroll,0);
		this.ground.autoScroll(groundScroll,0);
	},
	// Method for enhancing enemy parameters after reaching the threshold
	enhanceEnemies: function(){
		//increase rate
		if(this.ufoRate > 700){
			this.ufoRate -= 50;
			this.bossRate -= 50;
			this.missileRate -= 50;
		}
		this.ufoVelocity -= 50;
		this.bossVelocity -= 30;
		this.missileVelocity = this.bossVelocity * 1.9;
	},
	// Method for enhancing enemy parameters after reaching the threshold
	enhanceStars: function(){
		if(this.starRate > 700){
			this.starRate -= 50;
		}
		this.starVelocity -= 50;
		// Changing parameters of every instance in the group
		for(var i=0; i < this.stars.children.lenght;i++){
			this.stars[i].body.velocity.x = this.starVelocity;
		}
	},
	// Method for displaying a sprite sheet animation of explosion
	showExplosion: function(player){
		var explosion = this.game.add.sprite(player.body.x, player.body.y, "explosion");
		explosion.anchor.setTo(0,0.5);
		explosion.scale.setTo(6);
		explosion.animations.add("explode",[0,1,2,3,4,5],false);
      explosion.animations.play("explode").delay = 100;
	},
	// Method for stopping everything from spawning / moving
	stopSprites: function(){
		// Stop generating enemies
      this.ufoTimer = Number.MAX_VALUE;
      this.bossTimer = Number.MAX_VALUE;
		this.missileTimer = Number.MAX_VALUE;

		// Stop generating Stars
      this.starTimer = Number.MAX_VALUE;

		// Stop ground/background scrolling
		this.ground.stopScroll();
      this.background.stopScroll();

		// set velocity of existing sprites to 0 --> (parameter, value)
		this.ufos.setAll('body.velocity.x',0);
      this.bosses.setAll('body.velocity.x',0);
      this.stars.setAll('body.velocity.x',0);
      this.missiles.setAll('body.velocity.x',0);
	},
	// Method for setting initial parameters of the game
	resetInitialParams: function(){
		// After reaching the threshold, every object in the game wll be enhanced
		this.currentThreshold = 10;
		this.score = 0;

		this.previousStarType = null;
		this.starSpawnX = null;
		// Distance between stars when they are in a group
		this.starSpacingX = 10;
		this.starSpacingY = 10;
		this.starVelocity = -400;

		// How often game objects will be spawned
		this.starRate = 1500;
		this.starTimer = 0;

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
	// method for clearing the world before starting a new game
   shutdown: function() {
		// Destroying every game object
      this.stars.destroy();
      this.ufos.destroy();
		this.bosses.destroy();
		this.missiles.destroy();
   }

}
