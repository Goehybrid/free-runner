var UFO = function (game, x, y, key, velocity) {
	// game - reference to the game
	// x,y - coordinates
	// the key name of the object
	ENEMIES.call(this,game,x,y,key,velocity);
}

UFO.prototype = Object.create(ENEMIES.prototype);
UFO.prototype.constructor = UFO;

UFO.prototype.onRevived = function () {
	this.game.add.tween(this).to({y: this.y - 26}, 500, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
	this.body.velocity.x = this.velocity;
	this.animations.play('fly', 10, true);
}
