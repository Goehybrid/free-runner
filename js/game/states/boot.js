// This state sets up global configurations for the game

// Setting up the global game class that holds the game
var SpaceChase = function () {};
// Creating the boot state
SpaceChase.Boot = function () {};
// Extending prototype for the boot state
SpaceChase.Boot.prototype = {

	// The preload method is the first thing to run, and it is used to preload game assets
	preload: function () {
		// Preloading the logo image --> (key, location)
		this.load.image('logo', 'assets/images/logo.png');
	},

	// The create method is called once the preload has completed.
	// If the preload is absent, the create runs first
	create: function () {
		// Setting the background of the stage
		this.game.stage.backgroundColor = '#393939';

		// The max number of pointers that can be added
		this.input.maxpointers = 1;

		// checking if the game is running on the desktop
		if (this.game.device.desktop) {
			// aligning game vertically and horizontally
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
		}

		// starting the "Preloader" state --> (key)
		this.state.start('Preloader');
	}

};
