// getting the dimensions of the viewport
var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;

// setting the game dimensions
if(innerWidth > innerHeight){
   var game = new Phaser.Game(innerWidth,innerHeight, Phaser.CANVAS, '');
}

game.state.add('Boot',SpaceChase.Boot);
game.state.add('Preloader',SpaceChase.Preload);
game.state.add('MainMenu',SpaceChase.MainMenu);
game.state.add('Game',SpaceChase.Game);

game.state.start('Boot');
