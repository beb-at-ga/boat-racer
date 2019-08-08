class OpeningScene extends Phaser.Scene {

  constructor() {
    super('openingScene');
  }

  preload() {
    this.load.image('waterTexture', 'assets/waterTexture.png');
    this.load.image('arrowKeys', 'assets/arrowKeys.png');
    this.load.image('markerBuouyExample', 'assets/markerBuoyExample.png');
  }

  create() {
    addBackgroundTiles(this);

    this.input.keyboard.addKey('s').on('up', function () {
      this.scene.switch('gameScene');
    }, this);

    let header = `Boat Racer!`;
    this.add.text(380, 20, header, {
      font: '45px',
      fill: '#ffffff',
      align: 'left',
      fontFamily: '"Roboto Condensed"',
      strokeThickness: 2
    });



    let introText = `Your mission is simple. Race between the Sothern and Northern \nsets of marker buoys before the clock runs. The Nothern \nset isn't always in the same place! You must go through \nboth gates. Green on the left, red on the right. And don't\njump the starting gun! You WILL be disqualified.`;
    this.add.text(35, 200, introText, textDefaults);

    this.add.image(350, 350, 'markerBuouyExample').setOrigin(0, 0);

    let textLine2 = `Oh, and don't jump the gun on \nthe starting gate. You WILL be disqulaified`;
    this.add.text(35, 200, introText, textDefaults);

    let controlText = `The arrow keys control your boat. \n(left turn, thurst, right turn).`
    this.add.text(35, 460, controlText, textDefaults);

    this.add.image(675, 460, 'arrowKeys').setOrigin(0, 0);

    this.add.text(35, 600, `Press 'S' to start.`, textDefaults);

  }
  update() {}
}
