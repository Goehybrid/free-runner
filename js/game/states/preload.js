FreeRunner.Preload = function(){
    this.ready = false;
};

FreeRunner.Preload.prototype = {
    
    preload: function(){
        this.splash = this.add.sprite(this.game.world.centerX,this.game.world.centerY, 'logo');  
        this.splash.anchor.setTo(0.5);
        
        // DROP ASSETS HERE
        this.load.image('ground','assets/images/dirt.gif');
        this.load.image('background','assets/images/space.png');
        this.load.image('foreground','assets/images/tundra.gif');
        
        this.load.spritesheet('coins','assets/images/coins-ps.png', 51, 51, 7);;
        this.load.spritesheet('player','assets/images/spaceship.png',64,29,4);
        this.load.spritesheet('missile','assets/images/missiles-ps.png', 361, 218, 4);
        
        this.load.audio('gameMusic',['assets/audio/Pamgaea.mp3','assets/audio/Pamgaea.ogg']);
        this.load.audio('rocket','assets/audio/rocket.wav');
        this.load.audio('bounce','assets/audio/bounce.wav');
        this.load.audio('coin','assets/audio/coin.wav');
        this.load.audio('death','assets/audio/death.wav');
        
        this.load.bitmapFont('minecraftia','assets/fonts/minecraftia/minecraftia.png','assets/fonts/minecraftia/minecraftia.xml');
        
        // CALLBACK
        this.load.onLoadComplete.add(this.onLoadComplete, this);
    },
    
    create: function(){
        
        // LOADING TEXT
        this.loadingText = this.game.add.bitmapText(0, 0, 'minecraftia', 'Loading', 32);
        this.loadingText.x = this.game.width / 2 - this.loadingText.textWidth / 2;
        this.loadingText.y = this.game.height / 2 + this.splash.height / 2;
    },
    
    update: function(){
        if(this.cache.isSoundDecoded('gameMusic') && this.ready === true){
            this.state.start('MainMenu');   
        }
    },
    
    onLoadComplete: function(){
        this.ready = true;   
    }
};
