// class that holds the behavior of the BOSS objects
var BOSS = function (game, x, y, key, velocity) {
	// calling the ENEMIES superclass, the last argument is the scale factor
	ENEMIES.call(this,game,x,y,key,velocity, 2);
	// Creating a custom animation by repeating a set of frames --> (key,[frames])
	this.animations.add('fly',[0,1,2,3,4,5,4,3,2,1]);
}

// Extending prototype of ENEMIES
BOSS.prototype = Object.create(ENEMIES.prototype);
// Specifying the constructor
BOSS.prototype.constructor = BOSS;
// Method triggered when the object is created
BOSS.prototype.onRevived = function () {
	// adding animation to the object --> (object).to(properties, duration,ease,autostart,delay,repeat,yoyo)
	this.game.add.tween(this).to({y: this.y - 8}, 700, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
	// Setting the default velocity along x-axis
	this.body.velocity.x = this.velocity;
	// Playing the custom animation --> (key, rate, loop)
	this.animations.play('fly', 7, true);
}

