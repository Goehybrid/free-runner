var Boss = function (game, x, y, key, velocity) {
	// game - reference to the game
	// x,y - coordinates
	// the key name of the object
	// frame specification

	this.key = key;
	Phaser.Sprite.call(this, game, x, y, key);

	this.scale.setTo(2);
	this.anchor.setTo(0.5);

	this.velocity = velocity
	this.animations.add('fly');
	this.game.physics.arcade.enableBody(this);
	this.body.allowGravity = false;

	// check if boss is outside of the game world
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;

	// events when boss is revived
	this.events.onRevived.add(this.onRevived, this);
}

Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;


Boss.prototype.onRevived = function () {
	this.game.add.tween(this).to({y: this.y - 8}, 700, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
	this.body.velocity.x = this.velocity;
	this.animations.play('fly', 10, true);
}
