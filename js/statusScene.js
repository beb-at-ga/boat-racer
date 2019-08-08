class StatusScene extends Phaser.Scene {
  constructor() {
    super('statusScene');
  }
  preload() {}
  create() {

    let raceTimeText = this.add.text(450, 350, null, textDefaults);

    if (!timerInterval) {

      timerInterval = setInterval(function () {
        raceTimer += 1;
        switch (raceTimer) {
          case -34:
            raceTimeText.setText('Ready!');
            break;
          case -32:
            raceTimeText.setText('Set!');
            break;
          case -30:
            raceTimeText.setText('GO!');
            break;
        }
        if (raceTimer <= 0 && raceTimer >= -29) {
          raceTimeText.x = 0;
          raceTimeText.y = 0;
          raceTimeText.setText(`Time: ${-raceTimer} \nHull strength: ${player1.hullStrengh}`);
        }
      }, 700);
    }
  }
}
