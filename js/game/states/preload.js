SpaceChase.Preload = function () {
   this.ready = false;
};

SpaceChase.Preload.prototype = {

   preload: function () {

      this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
      this.logo.anchor.setTo(0.5);

      // DROP ASSETS HERE
      this.load.image('ground', 'assets/images/dirt.gif');
      this.load.image('background', 'assets/images/space.png');

      this.load.spritesheet('coins', 'assets/images/stars.png', 65.14, 78, 7);
      this.load.spritesheet('player', 'assets/images/spaceship.png', 64, 29, 4);
      this.load.spritesheet('ufo', 'assets/images/ufo.png', 40, 30, 6);
		this.load.spritesheet('boss','assets/images/boss.png', 40, 30, 6);
		this.load.spritesheet('missile','assets/images/missile.png',361, 218, 4);
      this.load.spritesheet('explosion','assets/images/explode.png',26,26,6);
      this.load.spritesheet('exhaust','assets/images/flame.png',200,33,6);


      this.load.audio('gameMusic','assets/audio/theme.wav');
      this.load.audio('rocket', 'assets/audio/launch.wav');
      this.load.audio('coin', 'assets/audio/star.wav');
      this.load.audio('death', 'assets/audio/explosion.wav');

      this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia/minecraftia.png', 'assets/fonts/minecraftia/minecraftia.xml');

      // CALLBACK
      this.load.onLoadComplete.add(this.onLoadComplete, this);
   },

   create: function () {

      // adding a loading text to the game --> (x-coord,y-coord,key,text value, font size)
      this.loadingText = this.game.add.bitmapText(0, 0, 'minecraftia', 'Loading', 32);
      this.loadingText.x = this.game.width / 2;
      this.loadingText.y = this.game.height / 2 + this.logo.height / 2;

		// adding animation to text --> (object).to(properties, duration,ease,autostart,delay,repeat,yoyo)
		this.game.add.tween(this.loadingText).to({x: this.loadingText.x-200}, 500, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
   },

   update: function () {
      if (this.cache.isSoundDecoded('gameMusic') && this.ready === true) {
         this.state.start('MainMenu');
      }
   },

   onLoadComplete: function () {
      this.ready = true;
   }
};
