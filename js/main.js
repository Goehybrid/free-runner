// getting the dimensions of the viewport
var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;

// The Game object is the core of the game, providing access to
// common functions and handling the boot process.
// Positioning of the Game object --> (width, height, renderer, the parent DOM element)
var game = new Phaser.Game(innerWidth,innerHeight, Phaser.CANVAS, '');

// Adding states to the main game object --> (key,state)
game.state.add('Boot',SpaceChase.Boot);
game.state.add('Preloader',SpaceChase.Preload);
game.state.add('MainMenu',SpaceChase.MainMenu);
game.state.add('Game',SpaceChase.Game);

// starting the "Boot" state --> (key)
game.state.start('Boot');
