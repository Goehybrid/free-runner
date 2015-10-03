var Coin = function(game, x, y, key, frame){
    key='coins';
    Phaser.Sprite.call(this, game, x, y, key, frame);
    
    this.scale.setTo(0.5);
    this.anchor.setTo(0.5);
    
    this.animations.add('spin');
    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
}

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;