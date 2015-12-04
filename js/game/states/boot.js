var SpaceChase = function(){};

SpaceChase.Boot = function(){};

SpaceChase.Boot.prototype = {
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
            this.scale.pageAlignVertically = true;
        }
        
        this.state.start('Preloader');
    }
    
};
