// Creating the MainMenu state
SpaceChase.MainMenu = function () {};

// Extending the prototype for the main menu state
SpaceChase.MainMenu.prototype = {

	create: function () {
		// Setting the background of the game --> (x-coord, y-coord, width, height, key)
		this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
		// Setting autoscroll of the background --> (x-scroll speed, y-scroll speed)
		this.background.autoScroll(-100, 0);

		// Adding a ground to the game --> (x-coord, y-coord, width, height, key)
		this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
		// Setting autoscroll of the ground --> (x-scroll speed, y-scroll speed)
		this.ground.autoScroll(-400, 0);

		// Adding the main player to the game --> (x-coord, y-coord, key)
		this.player = this.add.sprite(100, this.game.height / 2, 'player');
		// Setting the anchor of the player to be in the center of the image
		this.player.anchor.setTo(0.5);

		// Setting up a custom animation --> (key, [frame numbers])
		this.player.animations.add('fly', [0, 1, 2, 3, 2, 1]);
		// Playing the custom animation --> (key, frame rate, loop)
		this.player.animations.play('fly', 8, true);

		// adding animation to the player --> (object).to(properties, duration,ease,autostart,delay,repeat,yoyo)
		this.game.add.tween(this.player).to({y: this.player.y - 16}, 500, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);

		// Creating a sprite for the game logo --> (x-coord, y-coord, key)
		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		// Setting the anchor of the game logo to be in the center of the image
		this.splash.anchor.setTo(0.5);

		// adding the prompting to the game --> (x-coord, y-coord, key, text value, font size)
		this.startText = this.game.add.bitmapText(0, 0, 'minecraftia', 'Tap to start', 32);
		this.startText.x = this.game.width / 2 - this.startText.textWidth / 2;
		this.startText.y = this.game.height / 2 + this.splash.height / 2;

		// Reset the high score value --> (key, value)
		localStorage.setItem('highscore', 0);
	},

	// Listening for the user input
	update: function () {
		if (this.game.input.activePointer.justPressed()) {
			this.game.state.start('Game');
		}
	}
}
