// class that holds the behavior of the STAR objects
var STAR = function (game, x, y, key, velocity) {
	// calling the Phaser.Sprite superclass
	Phaser.Sprite.call(this, game, x, y, key);
	// resizing the object --> (scale factor)
	this.scale.setTo(0.3);
	// Setting the anchor of the object to be in the center
	this.anchor.setTo(0.5);
	// Setting the speed of the object
	this.velocity = velocity;
	// Creating a custom animation by repeating a set of frames --> (key,[frames, full sequence by default])
	this.animations.add('spin');
	// Creating an Arcade Physics body on the given game object --> (context)
	this.game.physics.arcade.enableBody(this);
	// Allow this body to be influenced by gravity
	this.body.allowGravity = false;
	// Checking if it is within the World bounds each frame.
	this.checkWorldBounds = true;
	// Killing the object if it is outside the World bounds
	this.outOfBoundsKill = true;

	// Specifying the callback that will be triggered when
	// the asset is created --> (method to fire, context)
	this.events.onKilled.add(this.onKilled, this);
	// Specifying the callback tha will be triggered when
	// the asset is killed --> (method to fire, context)
	this.events.onRevived.add(this.onRevived, this);
}

// Extending prototype of Phaser.Sprite
STAR.prototype = Object.create(Phaser.Sprite.prototype);
// Specifying the constructor
STAR.prototype.constructor = STAR;
// Method triggered when the object is created
STAR.prototype.onRevived = function () {
	// Setting the default velocity along x-axis
	this.body.velocity.x = this.velocity;
	// Playing the custom animation --> (key, rate, loop)
	this.animations.play('spin', 10, true);
}
// Method triggered when the object is killed
STAR.prototype.onKilled = function () {
	// reset the frame number, all stars spin synchronously
	this.animations.frame = 0;
	// destroying the object
	this.destroy();
}
