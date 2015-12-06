var MISSILE = function (game, x, y, key, velocity) {
	// game - reference to the game
	// x,y - coordinates
	// the key name of the object
	ENEMIES.call(this,game,x,y,key,velocity, 0.1);
}

MISSILE.prototype = Object.create(ENEMIES.prototype);
MISSILE.prototype.constructor = MISSILE;

MISSILE.prototype.onRevived = function () {
	this.game.add.tween(this).to({y: this.y - 8}, 600, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
	this.body.velocity.x = this.velocity;
	this.animations.play('fly', 10, true);
}
