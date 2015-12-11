// Class that holds the behavior of the UFO objects
var MISSILE = function (game, x, y, key, velocity) {
	// calling the ENEMIES superclass, the last argument is the scale factor
	ENEMIES.call(this,game,x,y,key,velocity, 0.1);
	// Creating a custom animation by repeating a set of frames --> (key,[frames])
	this.animations.add('fly',[0,1,2,3,2,1]);
}

// Extending prototype of ENEMIES
MISSILE.prototype = Object.create(ENEMIES.prototype);
// Specifying the constructor
MISSILE.prototype.constructor = MISSILE;
// Method triggered when the object is created
MISSILE.prototype.onRevived = function () {
	// adding animation to the object --> (object).to(properties, duration,ease,autostart,delay,repeat,yoyo)
	this.game.add.tween(this).to({y: this.y - 8}, 600, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
	// Setting the default velocity along x-axis
	this.body.velocity.x = this.velocity;
	// Playing the custom animation --> (key, rate, loop)
	this.animations.play('fly', 10, true);
}
