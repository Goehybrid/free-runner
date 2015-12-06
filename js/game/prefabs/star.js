var STAR = function(game, x, y, key, velocity){
    // game - reference to the game
    // x,y - coordinates
    // the key name of the object

    Phaser.Sprite.call(this, game, x, y, key);

    this.scale.setTo(0.3);
    this.anchor.setTo(0.5);

	 this.velocity = velocity;

    this.animations.add('spin');
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;

    // check if STAR is outside of the game world
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    // events when STAR is killed/revived
    this.events.onKilled.add(this.onKilled, this);
    this.events.onRevived.add(this.onRevived, this);
}

STAR.prototype = Object.create(Phaser.Sprite.prototype);
STAR.prototype.constructor = STAR;

STAR.prototype.onRevived = function(){
    this.body.velocity.x = this.velocity;
    this.animations.play('spin',10,true);
}
STAR.prototype.onKilled = function(){
    // reset the frame number
    this.animations.frame = 0;
	 this.destroy();
}
