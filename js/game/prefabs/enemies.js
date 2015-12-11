// superclass that holds the behavior of enemies
var ENEMIES = function(game, x, y, key, velocity, scale){
	if(scale == null){
		scale = 1;
	}
	// calling the Phaser.Sprite superclass
	Phaser.Sprite.call(this, game, x, y, key);
	// resizing the object --> (scale factor)
	this.scale.setTo(scale);
	// Setting the anchor of the object to be in the center
	this.anchor.setTo(0.5);
	// Setting the speed of the object
	this.velocity = velocity;
	// Creating an Arcade Physics body on the given game object --> (context)
	this.game.physics.arcade.enableBody(this);
	// Allow this body to be influenced by gravity
	this.body.allowGravity = false;
	// Checking if it is within the World bounds each frame.
	this.checkWorldBounds = true;
	// Killing the object if it is outside the World bounds
	this.outOfBoundsKill = true;
	// Specifying the callback that will be triggered when
	// the asset is created --> (function to fire, context)
	this.events.onRevived.add(this.onRevived, this);
}

// Extending prototype of Phaser.Sprite
ENEMIES.prototype = Object.create(Phaser.Sprite.prototype);
// Specifying the constructor
ENEMIES.prototype.constructor = ENEMIES;







