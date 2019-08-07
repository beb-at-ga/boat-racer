// class AnyScene extends Phase.Scene {
//   initialize(){
//   }
//   preload() {
//   }
//   create() {
//   }
//   update() {
//   }
// }

class OpeningScene extends Phaser.Scene {

  constructor() {
    super('openingScene');
  }
  initialize() {}
  preload() {
    this.load.image('waterTexture', 'assets/waterTexture.png');
  }
  create() {
    addBackgroundTiles(this);
    this.input.keyboard.on('keydown', function () {
      this.scene.switch('gameScene');
    }, this);

    this.add.text(0, 0, "Opening Scene", {
      font: '32px Arial',
      fill: '#ffffff',
      align: 'center',
      strokeThickness: 3
    });
  }
  update() {}
}

class GameOverScene extends Phaser.Scene {

  constructor() {
    super('gameOverScene');
  }

  preload() {
    this.load.image('waterTexture', 'assets/waterTexture.png');
  }
  create() {
    addBackgroundTiles(this);

    this.input.keyboard.on('keydown', function () {
      this.scene.switch('gameScene');
    }, this);

    this.add.text(0, 0, "Game Over", {
      font: '32px Arial',
      fill: '#ffffff',
      align: 'center',
      strokeThickness: 3
    });
  }
  update() {}
}

class StatusScene extends Phaser.Scene {
  constructor() {
    super('statusScene');
  }
  preload() {}
  create() {

    let raceTimeText = this.add.text(0, 0, null, {
      font: '32px Arial',
      fill: '#ffffff',
      align: 'center',
      fontFamily: '"Roboto Condensed"',
      strokeThickness: 2
    });
    raceTimeText.fixedToCamera = true;


    if (!timerInterval) {
      timerInterval = setInterval(function () {
        raceTimer += 1;
        switch (raceTimer) {
          case -36:
            raceTimeText.setText('Ready!');
            break;
          case -33:
            raceTimeText.setText('Set!');
            break;
          case -30:
            raceTimeText.setText('GO!');
            break;
        }

        if (raceTimer < 0 && raceTimer >= -29) {
          raceTimeText.setText(`${-raceTimer}`);
        }
      }, 1000);
    }


  }
  update() {}
}

class GameScene extends Phaser.Scene {

  constructor() {
    super('gameScene');
    // this.waterTexture;
    // this.powerBoat;
    // this.plainBuoy;
    // this.redBuoy;
    // this.greenBuoy;
  }

  preload() {
    this.load.image('powerBoat', 'assets/powerBoat.png');
    this.load.image('waterTexture', 'assets/waterTexture.png');
    this.load.image('plainBuoy', 'assets/plainBuoy.png');
    this.load.image('redBuoy', 'assets/redBuoy.png');
    this.load.image('greenBuoy', 'assets/greenBuoy.png');
    this.load.spritesheet('kaboom', 'assets/explode.png', {
      frameWidth: 128,
      frameHeight: 128
    });

  }
  create() {

    let explosionAudio = new Audio('assets/explosion.mp3');


    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('kaboom', {
        start: 0,
        end: 15
      }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true
    });

    let explosions = this.add.group({
      defaultKey: 'kaboom',
      maxSize: 30
    });

    // Add the status scene to this one. 
    game.scene.start('statusScene');
    // this.scene.add('statusScene', StatusScene, true);

    // Build up the scene.:
    let world = this.matter.world;
    world.setBounds(0, 0, bW, bH);
    world.label = 'moBoundary'; // is this working?
    addBackgroundTiles(this);

    // BEB - Sets up random wind and tide as "gravity" on the X,Y access.
    // Isn't very realistic. Each should be dirction and velocity, weighted
    // based on the profile of the vessel, and calculated together to generate
    // and X/Y "gravity.
    let wind = (Math.random() * (windConstraints[1] - windConstraints[0]) + windConstraints[0]);
    let tide = (Math.random() * (tideContstraints[1] - tideContstraints[0]) + tideContstraints[0])
    this.matter.world.setGravity(wind, tide);
    this.matter.world.setGravity(wind, tide);

    // Build starting gate with sensor.
    // place to static starting buoys.
    // place a sensor rectangle between them.
    // watch for when the player1 object interacts with the sensor.

    let startingBuoyPort = this.matter.add.sprite((bW / 2) - 100, (bH - 200), 'greenBuoy', null, {
      isStatic: true,
      label: 'moMarkerBuoy',
      damage: 15
    });
    let startingBuoyStarboard = this.matter.add.sprite((bW / 2) + 100, (bH - 200), 'redBuoy', null, {
      isStatic: true,
      label: 'moMarkerBuoy',
      damage: 15
    });
    startingBuoyPort.flipX = true;
    startingBuoyPort.flipY = true;
    startingBuoyStarboard.flipX = true;
    startingBuoyStarboard.flipY = true;

    // the x coord here seems to centered in the rect.
    let startingGateSensor = this.matter.add.rectangle(((bW / 2)), (bH - 200), 200, 10, {
      isSensor: true,
      label: 'moStartingGateSensor',
      isStatic: true
    });

    let endingBuoyPort = this.matter.add.sprite((bW / 2) - 100, 200, 'greenBuoy', null, {
      isStatic: true,
      label: 'moMarkerBuoy',
      damage: 15
    });
    let endingBuoyStarboard = this.matter.add.sprite((bW / 2) + 100, 200, 'redBuoy', null, {
      isStatic: true,
      label: 'moMarkerBuoy',
      damage: 15
    });
    endingBuoyPort.flipX = true;
    endingBuoyPort.flipY = true;
    endingBuoyStarboard.flipX = true;
    endingBuoyStarboard.flipY = true;

    // the x coord here seems to centered in the rect.
    let endingGateSensor = this.matter.add.rectangle(((bW / 2)), 200, 200, 10, {
      isSensor: true,
      label: 'moEndingGateSensor',
      isStatic: true
    });


    // Build player boat.
    player1 = this.matter.add.sprite(bW / 2, bH - 100, 'powerBoat', null, {
      label: 'moPlayer1'
    }); // player1.setFixedRotation(0); // BEB - It's unclear what 
    player1.angle = -90;
    player1.label = 'goPlayer1';
    player1.setFrictionAir(0.15, 0);
    player1.setMass(30);
    player1.hullStrengh = 100;
    player1.setAllowDrag = true;
    // player1.setDrag(100, 0);
    // this.body.setFriction(0.7, 0)



    // player1.setFixedRotation(0); // BEB - It's unclear what this is doing...
    let tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
    let tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);


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
      // interesting. this is a gameobject, where they preceeding lable is a matter body label...
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
    this.matter.world.on('collisionstart', function (event) {
      let collPairs = event.pairs;

      // console.log(`${collPairs}`);

      for (let i = 0; i < collPairs.length; i++) {
        let pair = collPairs[i];

        let bALabel = pair.bodyA.label;
        let bBLabel = pair.bodyB.label;

        switch (true) {
          // Player collides with starting gate. Start the timer (should determine directionality)
          case (pair.isSensor && (bALabel === 'moPlayer1' || bBLabel === 'moPlayer1') && (bALabel === 'moStartingGateSensor' || bBLabel === 'moStartingGateSensor')):
            console.log('moPlayer1 crossed starting gate.');
            break;
            // Player collides with ending gate. Stop the timer (should determine directionality)
          case (pair.isSensor && (bALabel === 'moPlayer1' || bBLabel === 'moPlayer1') && (bALabel === 'moEndingGateSensor' || bBLabel === 'moStartingGateSensor')):
            clearInterval(timerInterval);
            // if raceTimer < 0, we have a winner!

            game.scene.stop('statusScene');
            game.scene.start('gameOverScene');
            break;
            // plain buoy
          case ((bALabel === 'moPlayer1' || bALabel === 'moPlainBuoy') && (bBLabel === 'moPlayer1' || bBLabel === 'moPlainBuoy')):
            player1.hullStrengh -= collPairs[i].bodyB.damage;
            break;
            // marker buoy
          case ((bALabel === 'moPlayer1' || bALabel === 'moMarkerBuoy') && (bBLabel === 'moPlayer1' || bBLabel === 'moMarkerBuoy')):
            player1.hullStrengh -= collPairs[i].bodyA.damage;
            // console.log(pair);
            break;
          case ((bALabel === 'moPlayer1' || bALabel === 'moPlayer1') && (bBLabel === 'moPowerTarget' || bBLabel === 'moPowerTarget')):
            console.log(pair);
            player1.hullStrengh -= collPairs[i].bodyB.damage;
            break;
            // other vessel
          default:
            // console.log(`${pair.bodyA.label} collided with ${pair.bodyB.label}`);
            if (pair.bodyA.gameObject) {
              // console.log(`Watch where your going noob!!`);
              // console.log(`${pair.bodyA.gameObject.label} collided with ${pair.bodyB.gameObject.label}`);
            } else {
              // console.log(`${pair.bodyB.gameObject.label} collided with a border... I think.`)
              // console.log(pair);

              // // remove game object when it collides with the "borders"
              // // does not work
              // for(let x = 0; x < powerTargets.length; x++) {
              //   console.log(pair.bodyB.gameObject.label);
              //   if (powerTargets[x].label === pair.bodyB.gameObject.label) {
              //     powerTargets.splice(x, 1);
              //     x--;
              //     // world.remove();
              //   }
              // }

            }
            break;
        }

        if (player1.hullStrengh <= 50 && player1.hullStrengh > 20) {
          console.log('Boat is yellow.')
        } else if (player1.hullStrengh <= 20 && player1.hullStrengh >= 0) {
          console.log('Boat is red.')
        } else if (player1.hullStrengh < 0) {
          console.log('Boat is on fire and game is over.')
          explosionAudio.play();
          // Get the first explosion, and activate it.
          let explosion = explosions.get().setActive(true);

          explosion.setOrigin(0.5, 0.5);
          explosion.x = player1.x;
          explosion.y = player1.y;
          explosion.play('explode');

          explosion.on('animationcomplete', function () {
            explosion.destroy()

            setTimeout(function () {
              game.scene.start('gameOverScene');
              game.scene.stop('statusScene');
            }, 3000);

          });


        }

      }
    });



    // Setup the camera to follow:
    this.cameras.main.setBounds(0, 0, bW, bH);
    this.cameras.main.startFollow(player1);
    this.cameras.main.followOffset.set(0, 0); // unnecessary?
    // this.cameras.main.ignore([raceTimeText, raceResultsText1, raceResultsText2]);

    // resultsCamera = this.cameras.add();
    // resultsCamera.setBounds(0, 0, bW, bH);
    // resultsCamera.setAlpha(.8);
    // resultsCamera.startFollow(player1);
    // resultsCamera.setBackgroundColor('#FF0000');
    // resultsCamera.followOffset.set(0, 0); 
    // resultsCamera.ignore(backgroundTexture);



    // use default cursor keys
    cursors = this.input.keyboard.createCursorKeys();



    // // this is my exit code. when player has lost or won, transition to next scene
    // this.input.once('pointerdown', function () {
    //     this.scene.transition({
    //         target: 'gameOverScene',
    //         duration: 2000,
    //         moveBelow: true,
    //         onUpdate: this.transitionOut,
    //         data: {
    //             x: 400,
    //             y: 300
    //         }
    //     });
    // }, this);

  }
  update() {

    // let point1 = player1.getTopRight();
    // let point2 = player1.getBottomRight();
    // tracker1.setPosition(point1.x, point1.y);
    // tracker2.setPosition(point2.x, point2.y);


    if (cursors.left.isDown) {
      player1.setAngularVelocity(-0.05);
    } else if (cursors.right.isDown) {
      player1.setAngularVelocity(0.05);
    }
    if (cursors.up.isDown) {
      player1.inertia = .1;
      player1.inverseInertia = (1 / player1.inertia);
      player1.thrust(0.15);
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
  // parent: 'main',
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        x: 0,
        y: 0
      },
      // debug: true,
      // debugShowBody: true,
      // debugShowVelocity: true,
      // debugWireframes: true
    },
    arcade: {
      // debug: true,
      // gravity: { y: 200 }
    }
  },
  scene: [OpeningScene, GameScene, GameOverScene, StatusScene]
};

let boardScale = 4;
let player1;
let waterTexture;
let plainBuoys = [];
let numPlainBuoys = 20;
let powerTargets = [];
let numPowerTargets = 10;
let cursors;
let tideContstraints = [-0.3, 0.3];
let windConstraints = [-0.3, 0.3];
let bW = config.width * boardScale;
let bH = config.height * boardScale;
let timePenelty = 0; // will add to timePeneklty for each collision
let raceTimer = -37; // increment by time... 
let timerInterval;
let resultsCamera;
let backgroundTexture;
let raceResultsText1;
let raceResultsText2;

let getRand = function (min, max, type) {
  // type is undefined, float, or int
  if (type === 'int') {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  } else if (type === 'float') {

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