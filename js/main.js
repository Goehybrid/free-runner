var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

game.state.add('Boot',FreeRunner.Boot);
game.state.add('Preloader',FreeRunner.Preload);
game.state.add('MainMenu',FreeRunner.MainMenu);
game.state.add('Game',FreeRunner.Game);

game.state.start('Boot');