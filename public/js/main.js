class OpeningScene extends Phaser.Scene {

  constructor() {
    super('openingScene');
  }

  preload() {
    this.load.image('waterTexture', 'assets/waterTexture.png');
    this.load.image('arrowKeys', 'assets/arrowKeys.png');
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



    let introText = `Your mission is simple. Race between the marker buoys before\nthe clock runs out and don't hit anything! \nGreen on the left and red on the right.\n\nOh, and don't jump the gun on \nthe starting gate. You WILL be disqulaified.`;
    this.add.text(35, 200, introText, textDefaults);

    let controlText = `The arrow keys control your boat (left, up, right).`
    this.add.text(35, 450, controlText, textDefaults);

    this.add.image(830, 425, 'arrowKeys').setOrigin(0, 0);

    this.add.text(35, 530, "Press 'S' to start.", textDefaults);

  }
  update() {}
}

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
      }, 500);
    }
  }
}

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

class GameScene extends Phaser.Scene {

  constructor() {
    super('gameScene');
  }

  preload() {
    this.load.image('powerBoat', 'assets/powerBoat.png');
    this.load.image('waterTexture', 'assets/waterTexture.png');
    this.load.image('plainBuoy', 'assets/plainBuoy.png');
    this.load.image('redBuoy', 'assets/redBuoy.png');
    this.load.image('greenBuoy', 'assets/greenBuoy.png');
    this.load.spritesheet('explodeSprite', 'assets/explode.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.image('gameOver', 'assets/gameOver.png');
    this.load.audio('explosionAudio', 'assets/explosion.mp3');
    this.load.image('shark', 'assets/shark.png');

  }
  create() {

    let placeStartingGate = () => {
      // Set the starting marker buoys. Note coordinates.
      let startingBuoyPort = this.matter.add.sprite((bW / 2) - 100, (bH - 200), 'greenBuoy', null, {
        isStatic: true,
        label: 'moMarkerBuoy',
        damage: 15
      });
      startingBuoyPort.flipX = true;
      startingBuoyPort.flipY = true;
      
      let startingBuoyStarboard = this.matter.add.sprite((bW / 2) + 100, (bH - 200), 'redBuoy', null, {
        isStatic: true,
        label: 'moMarkerBuoy',
        damage: 15
      });
      startingBuoyStarboard.flipX = true;
      startingBuoyStarboard.flipY = true;
  
      // the x coord here seems to centered in the rect.
      let startingGateSensor = this.matter.add.rectangle(((bW / 2)), (bH - 200), 200, 10, {
        isSensor: true,
        label: 'moStartingGateSensor',
        isStatic: true
      });
    };

    let placeEndingGate = () => {
      let endingBuoyPort = this.matter.add.sprite(getRand(0, (bW - 100), 'int') + 5, 200, 'greenBuoy', null, {
        isStatic: true,
        label: 'moMarkerBuoy',
        damage: 15
      });
      endingBuoyPort.flipX = true;
      endingBuoyPort.flipY = true;
  
      let endingBuoyStarboard = this.matter.add.sprite(endingBuoyPort.x + 200, 200, 'redBuoy', null, {
        isStatic: true,
        label: 'moMarkerBuoy',
        damage: 15
      });
      endingBuoyStarboard.flipX = true;
      endingBuoyStarboard.flipY = true;
  
      // the x coord here seems to centered in the rect.
      // let endingGateSensor = this.matter.add.rectangle(((bW / 2)), 200, 200, 10, {
      let endingGateSensor = this.matter.add.rectangle(endingBuoyPort.x, 200, 200, 10, {
        isSensor: true,
        label: 'moEndingGateSensor',
        isStatic: true
      });
  
    }


    // Build up the scene.
    let world = this.matter.world;
     world.setBounds(0, 0, bW, bH);

    addBackgroundTiles(this);

    this.scene.get('statusScene').scene.start();

    // Set "wind and tide"
    let wind = (Math.random() * (windConstraints[1] - windConstraints[0]) + windConstraints[0]);
    let tide = (Math.random() * (tideContstraints[1] - tideContstraints[0]) + tideContstraints[0])
    world.setGravity(wind, tide);


    placeStartingGate();
    placeEndingGate();



    // this.matter.add.image(getRand(0, bW, 'int'), getRand(0, bH, 'int'), 'shark', null, {
    this.matter.add.imageStack('shark', null, getRand(0, bW, 'int'), getRand(0, bH, 'int'), 1, 1, 0, 0, {
      damage: 1000,
      label: 'moPowerTarget',
      ignorePointer: true,
      mass: 0.5,
      allowGravity: false
    });

    // Build player boat.
    player1 = this.matter.add.sprite(bW / 2, bH - 100, 'powerBoat', null, {
      label: 'moPlayer1',
      plugin: {
        attractors: [
          function (bodyA, bodyB) {
            return {
              x: (bodyA.position.x - bodyB.position.x) * 0.0000001,
              y: (bodyA.position.y - bodyB.position.y) * 0.0000001
            };
          }
        ]
      }
    }); // player1.setFixedRotation(0); // BEB - It's unclear what 
    player1.angle = -90;
    player1.label = 'goPlayer1';
    player1.setFrictionAir(0.15, 0);
    player1.setMass(30);
    player1.hullStrengh = 100;
    player1.setAllowDrag = true;


    // Build sailTargets
    // TODO - copy powerTargets and modify.


    // Build other mobile targets... whates?
    // TODO - copy powerTargets and modify.


    // Build staticTargets or other targets.
    let plainBuoys = [];
    for (let i = 0; i < numPlainBuoys; i++) {
      plainBuoys[i] = this.matter.add.sprite(getRand(0, bW, 'int'), getRand(0, bH, 'int'), 'plainBuoy', null, {
        isStatic: true,
        label: 'moPlainBuoy',
        damage: 20
      });
      plainBuoys[i].flipX = true;
      plainBuoys[i].flipY = true;
      plainBuoys[i].label = 'goPlayBuoy' + i;
    }

    // Build powerTargets
    for (let i = 0; i < numPowerTargets; i++) {
      powerTargets[i] = this.matter.add.image(getRand(0, bW, 'int'), getRand(0, bH, 'int'), 'powerBoat', null, {
        damage: 5,
        label: 'moPowerTarget'
      });
      powerTargets[i].angle = getRand(0, 360, 'int');
      powerTargets[i].setFrictionAir(0.15);
      powerTargets[i].setMass(30);
      powerTargets[i].label = 'goPowerTarget' + i;
    }

    // Manage all collisions:
    world.on('collisionstart', function (event) {
      let collPairs = event.pairs;

      for (let i = 0; i < collPairs.length; i++) {

        let pair = collPairs[i];
        let bALabel = pair.bodyA.label;
        let bBLabel = pair.bodyB.label;

        switch (true) {
          // Player collides with starting gate. Start the timer (should determine directionality)
          case (pair.isSensor && (bALabel === 'moPlayer1' || bBLabel === 'moPlayer1') && (bALabel === 'moStartingGateSensor' || bBLabel === 'moStartingGateSensor')):

            if (raceTimer < -30) {
              game.scene.start('gameOverScene');
            } else {
              startGatePassage = true;
            }

            break;

            // Player collides with ending gate. Stop the timer (should determine directionality)
          case (pair.isSensor && (bALabel === 'moPlayer1' || bBLabel === 'moPlayer1') && (bALabel === 'moEndingGateSensor' || bBLabel === 'moStartingGateSensor')):

            if (startGatePassage === true) {
              winner = true;
              game.scene.start('gameOverScene');
            } else {
              winner = true;
              game.scene.start('gameOverScene');
            }

            break;

            // plain buoy
          case ((bALabel === 'moPlayer1' || bALabel === 'moPlainBuoy') && (bBLabel === 'moPlayer1' || bBLabel === 'moPlainBuoy')):
            player1.hullStrengh -= collPairs[i].bodyB.damage;
            break;
            // marker buoy

          case ((bALabel === 'moPlayer1' || bALabel === 'moMarkerBuoy') && (bBLabel === 'moPlayer1' || bBLabel === 'moMarkerBuoy')):
            player1.hullStrengh -= collPairs[i].bodyA.damage;
            break;
            // power targets

          case ((bALabel === 'moPlayer1' || bALabel === 'moPowerTarget') && (bBLabel === 'moPowerTarget' || bBLabel === 'moPlayer1')):
            if (bALabel === 'moPlayer1') {
              player1.hullStrengh -= collPairs[i].bodyB.damage;
            } else if (bBLabel === 'moPlayer1') {
              player1.hullStrengh -= collPairs[i].bodyA.damage;
            }
            break;

            // any two objects.
          default:
            if (pair.bodyA.gameObject) {
              // console.log(`Watch where your going noob!!`);
              // console.log(`${pair.bodyA.gameObject.label} collided with ${pair.bodyB.gameObject.label}`);
            } else {
              // console.log(`${pair.bodyB.gameObject.label} collided with a border... I think.`)
            }
            break;
        }
      }
    });



    // Setup the camera to follow:
    this.cameras.main.setBounds(0, 0, bW, bH);
    this.cameras.main.startFollow(player1);
    this.cameras.main.followOffset.set(0, 0); // unnecessary?

    cursors = this.input.keyboard.createCursorKeys();

  }
  update() {

    if (player1.hullStrengh <= 50 && player1.hullStrengh > 20) {
      // console.log('Boat is yellow.')
    } else if (player1.hullStrengh <= 20 && player1.hullStrengh >= 0) {
      // console.log('Boat is red.')
    } else if (player1.hullStrengh < 0 || raceTimer >= 0) {
      // console.log('Boat is on fire and game is over.')
      clearInterval(timerInterval);

      this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explodeSprite', {
          start: 0,
          end: 15
        }),
        frameRate: 12,
        repeat: 2,
        hideOnComplete: true
      });

      let explosions = this.add.group({
        defaultKey: 'explodeSprite',
        maxSize: 30
      });

      if (!explosion) {
        let explosionAudio = this.sound.add('explosionAudio');
        explosionAudio.play();
        explosion = explosions.get().setActive(true);
        explosion.setOrigin(0.5, 0.5);
        explosion.x = player1.x;
        explosion.y = player1.y;
        explosion.play('explode');

        explosion.on('animationcomplete', function () {
          game.scene.start('gameOverScene');
        });
      }
    }

    if (cursors.left.isDown) {
      player1.setAngularVelocity(-0.05);
    } else if (cursors.right.isDown) {
      player1.setAngularVelocity(0.05);
    }
    if (cursors.up.isDown) {
      player1.inertia = 100;
      player1.inverseInertia = (1 / player1.inertia);
      player1.thrust(0.06);
    }

    powerTargets.forEach(e => {
      e.thrust(getRand(0, .05));
    })
  }
}

let config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  backgroundColor: '#006994',
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        scale: 0
      },
      plugins: {
        attractors: true
      }
    }
  },
  scene: [OpeningScene, GameScene, GameOverScene, StatusScene]
};


let player1;
let waterTexture;
const boardScale = 2;
const bW = config.width * boardScale;
const bH = config.height * boardScale;

let plainBuoys = [];
const numPlainBuoys = 15;

let powerTargets = [];
const numPowerTargets = 5;

let cursors;
const tideContstraints = [-0.3, 0.3];
const windConstraints = [-0.3, 0.3];

const raceTimerStart = -35; //increment by time... 
let raceTimer = raceTimerStart;
let timerInterval;

let resultsCamera;
let backgroundTexture;
let explosion;
let winner = false;
let startGatePassage = false;


let textDefaults = {
  font: '25px',
  fill: '#ffffff',
  align: 'left',
  fontFamily: '"Roboto Condensed"',
  strokeThickness: 2
}

let getRand = function (min, max, type) {
  if (type === 'int') {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  } else {
    return Math.random() * (max - min) + min;
  }
}




let addBackgroundTiles = function (scene) {
  for (let x = 0; x <= boardScale; x++) {
    for (let y = 0; y <= boardScale; y++) {
      backgroundTexture = scene.add.image(config.width * x, config.height * y, 'waterTexture').setOrigin(0, 0);
    }
  }
}

let game = new Phaser.Game(config);