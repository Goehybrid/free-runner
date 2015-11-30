var Coin = function(game, x, y, key, velocity,frame){
    // game - reference to the game
    // x,y - coordinates
    // the key name of the object
    // frame specification

    key="coins";
    Phaser.Sprite.call(this, game, x, y, key, frame);
    
    this.scale.setTo(0.3);
    this.anchor.setTo(0.5);

	 this.velocity = velocity;
    
    this.animations.add('spin');
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;

    // check if coin is outside of the game world
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    // events when coin is killed/revived
    this.events.onKilled.add(this.onKilled, this);
    this.events.onRevived.add(this.onRevived, this);
}

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;

Coin.prototype.onRevived = function(){
    this.body.velocity.x = this.velocity;
    this.animations.play('spin',10,true);
}
Coin.prototype.onKilled = function(){
    // reset the frame number
    this.animations.frame = 0;
	 this.destroy();
}
