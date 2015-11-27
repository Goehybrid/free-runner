var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;

if(innerWidth > innerHeight){
   var game = new Phaser.Game(innerWidth,innerHeight, Phaser.CANVAS, '');
}

game.state.add('Boot',FreeRunner.Boot);
game.state.add('Preloader',FreeRunner.Preload);
game.state.add('MainMenu',FreeRunner.MainMenu);
game.state.add('Game',FreeRunner.Game);

game.state.start('Boot');
