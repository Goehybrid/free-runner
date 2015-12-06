var BOSS = function (game, x, y, key, velocity) {
	// game - reference to the game
	// x,y - coordinates
	// the key name of the object
	ENEMIES.call(this,game,x,y,key,velocity, 2);
}

BOSS.prototype = Object.create(ENEMIES.prototype);
BOSS.prototype.constructor = BOSS;

BOSS.prototype.onRevived = function () {
	this.game.add.tween(this).to({y: this.y - 8}, 700, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
	this.body.velocity.x = this.velocity;
	this.animations.play('fly', 10, true);
}

