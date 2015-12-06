var ENEMIES = function(game, x, y, key, velocity, scale){
	if(scale == null){
		scale = 1;
	}
	Phaser.Sprite.call(this, game, x, y, key);
	this.scale.setTo(scale);
	this.anchor.setTo(0.5);
	this.velocity = velocity;
	this.animations.add('fly');
	this.game.physics.arcade.enableBody(this);
	this.body.allowGravity = false;
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;
	this.events.onRevived.add(this.onRevived, this);
}

ENEMIES.prototype = Object.create(Phaser.Sprite.prototype);
ENEMIES.prototype.constructor = ENEMIES;







