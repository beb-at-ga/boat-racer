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
      let endingBuoyPort = this.matter.add.sprite(getRand(0, (bW - 150), 'int') + 5, 200, 'greenBuoy', null, {
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
    this.matter.add.imageStack('shark', null, getRand(0, bW, 'int'), getRand(0, bH, 'int'), 1, 2, 0, 0, {
      damage: 1000,
      label: 'moPowerTarget',
      ignorePointer: true,
      mass: 0.45,
      allowGravity: false
    });

    // Build player boat.
    player1 = this.matter.add.sprite(bW / 2, bH - 100, 'powerBoat', null, {
      label: 'moPlayer1',
      allowGravity: false,
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
    });

    player1.label = 'goPlayer1';
    player1.angle = -90;
    player1.hullStrengh = 100;
    player1.setFrictionAir(0.15);
    player1.setMass(30);

    // Build sailTargets
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
      player1.thrust(0.075);

    }

    powerTargets.forEach(e => {
      e.thrust(getRand(0, .05));
    })
  }
}