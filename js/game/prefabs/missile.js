var Missile = function(game, x, y, key, velocity){
    // game - reference to the game
    // x,y - coordinates
    // the key name of the object
    // frame specification

	 key="missile";
    Phaser.Sprite.call(this, game, x, y, key);

    this.scale.setTo(0.3);
    this.anchor.setTo(0.5);

	 this.velocity = velocity;

    this.animations.add('fly');
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;

    // check if Missile is outside of the game world
    this.checkWorldBounds = true;
    this.onOutOfBoundsKill = true;

    // events when Missile is revived
    this.events.onRevived.add(this.onRevived, this);
}

Missile.prototype = Object.create(Phaser.Sprite.prototype);
Missile.prototype.constructor = Missile;

Missile.prototype.onRevived = function(){
    this.game.add.tween(this).to({y:this.y-8}, 600, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
    this.body.velocity.x = this.velocity;
    this.animations.play('fly',10,true);
}

