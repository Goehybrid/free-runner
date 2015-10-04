FreeRunner.Game = function(){
    this.playerMinAngle = -20;
    this.playerMaxAngle = 20;
    this.coinRate = 1000; // appear every second
    this.coinTimer = 0;   // check every game loop if the coin was created
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

        // COINS GROUP
        this.coins = this.game.add.group();
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
        
        // COINS
        if(this.coinTimer < this.game.time.now){
            // A NEW COIN IS CREATED EVERY SECOND
            this.createCoin();
            this.coinTimer = this.game.time.now + this.coinRate;
        }

        // COLLISIONS
        this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
    },
    createCoin: function(){
        // SET COORDINATES
        var x = this.game.width;
        // RANDOM NUMBER FOR HEIGHT< DEPENDS ON THE HEIGHT OF THE GROUND
        var y = this.game.rnd.integerInRange(50,this.game.world.height - 192);
        // CHECK FOR RECYCLING
        var coin = this.coins.getFirstExists(false);
        if(!coin){
            coin = new Coin(this.game,0,0);
            this.coins.add(coin);
        }
        // RESET THE COIN
        coin.reset(x,y);
        coin.revive();
    },
    
    shutdown: function(){
        
    },
    
    groundHit: function(player, ground){
        player.body.velocity.y = -150;
    }
}
