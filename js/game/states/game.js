FreeRunner.Game = function(){
    this.playerMinAngle = -20;
    this.playerMaxAngle = 20;
};

FreeRunner.Game.prototype = {
    
    create: function(){
       this.background = this.game.add.tileSprite(0, 0, this.game.width, 600, 'background');
        this.background.autoScroll(-100, 0);
        
        this.foreground = this.game.add.tileSprite(0, 475, this.game.width, this.game.height - 533, 'foreground');
        this.foreground.autoScroll(-150, 0);
        
        this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
        this.ground.autoScroll(-400, 0);
        
        // PLAYER
        this.player = this.add.sprite(100, this.game.height/2,'player');
        this.player.anchor.setTo(0.5);
        
        this.player.animations.add('fly', [0, 1, 2, 3, 2, 1]);
        this.player.animations.play('fly', 8, true);
        
        // PHYSICS SETUP
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 500;
        
        // GROUND PHYSICS
        this.game.physics.arcade.enableBody(this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;
        
        // PLAYER PHYSICS
        this.game.physics.arcade.enableBody(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.bounce.set(0.25);
    },
    
    update: function(){
        if(this.game.input.activePointer.isDown){
            this.player.body.velocity.y -= 25;
        }
        
        // PLAYER ANGLE
        if(this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown){
            if(this.player.angle > 0){
                this.player.angle = 0;   
            }
            
            if(this.player.angle > this.playerMinAngle){
                this.player.angle -= 0.5;
            }
        } else if(this.player.body.velocity.y >= 0 && !this.game.input.activePointer.isDown){
            if(this.player.angle < this.playerMaxAngle){
                this.player.angle += 0.5;
            }
        }
        
        // COLLISIONS
        this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
    },
    
    shutdown: function(){
        
    },
    
    groundHit: function(player, ground){
        player.body.velocity.y = -150;
    }
}