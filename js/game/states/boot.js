var FreeRunner = function(){};

FreeRunner.Boot = function(){};

FreeRunner.Boot.prototype = {
    /* ADD IMAGES HERE */
    preload: function(){
        this.load.image('logo','assets/images/logo.png');
    },
    
    create: function(){
        this.game.stage.backgroundColor = '#393939'; 
        
        // MULTITOUCH SUPPORT
        this.input.maxpointers = 1;
        
        if(this.game.device.desktop){
            // DESKTOP SETTINGS
            this.scale.pageAlignHorizontally = true;
        } else {
            // MOBILE SETTINGS
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 568;
            this.scale.minHeight = 600;
            this.scale.maxWidth = 2048;
            this.scale.maxHeight = 1536;
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
        }
        
        this.state.start('Preloader');
    }
    
};