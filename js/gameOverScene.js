class GameOverScene extends Phaser.Scene {

  constructor() {
    super('gameOverScene');
  }

  preload() {
    this.load.image('waterTexture', 'assets/waterTexture.png');
    this.load.image('gameOver', 'assets/gameOver.png');
    this.load.audio('woohoo', 'assets/woohoo.mp3');
    this.load.audio('doh', 'assets/doh.mp3');
    this.load.audio('fatality', 'assets/fatality.mp3');
  }
  create() {

    player1.visible = false;
    game.scene.stop('statusScene');
    clearInterval(timerInterval);

    setTimeout(() => {

      addBackgroundTiles(this);

      this.input.keyboard.addKey('s').on('up', function () {
        // this bigest hack of all :( 
        location.reload();

        // // These restarts aren't working...
        // this.scene.get('statusScene').scene.restart();
        // this.scene.get('gameScene').scene.restart();
        // this.scene.switch('gameScene');
      }, this);

      this.add.image(212, 10, 'gameOver').setOrigin(0, 0);

      let winnerText;
      switch (true) {
        case (player1.hullStrengh <= 0):
          this.sound.add('fatality').play();
          winnerText = 'Forget your glasses today? Avoid all the things!';
          break;
        case (raceTimer >= 0):
          this.sound.add('fatality').play();
          winnerText = `I could have swam this course faster. Get a move on!!`
          break;
        case (startGatePassage === false && winner === false):
          this.sound.add('doh').play();
          winnerText = `Disqualified! Don't jump the gun.`
          break;
        case (startGatePassage === false && winner === true):
          this.sound.add('doh').play();
          winnerText = `Disqualified! You didn't pass through the starting gate!`
          break;
        default:
          this.sound.add('woohoo').play();
          winnerText = `Woohoo! You beat the clock and didn't get yourself killed! \nYou rock!`
      }


      this.add.text(30, 375, winnerText, textDefaults);

      // font('45px');

      this.add.text(30, 530, "Press 'S' to start again.", textDefaults);

    }, 1000);

  }
}
