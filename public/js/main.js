let config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  boardScale: 1,
  backgroundColor: '#006994',
  // parent: 'main',
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        x: 0,
        y: 0
      },
      debug: true,
      // debugShowBody: true,
      // debugShowVelocity: true,
      // debugWireframes: true
    },
    arcade: {
      debug: true,
      // gravity: { y: 200 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
};

let player1;
let waterTexture;
let plainBuoys = [];
let powerTargets = [];
let cursors;
let tideContstraints = [-0.3, 0.3];
let windConstraints = [-0.3, 0.3];
let bW = config.width * config.boardScale;
let bH = config.height * config.boardScale;

let game = new Phaser.Game(config);

if (!config.boardScale) {
  config.boardScale = 1;
}


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

// BEB - leave preload, create, and update as fn declarations. 
function preload() {
  this.load.image('powerBoat', 'assets/powerBoat.png');
  this.load.image('waterTexture', 'assets/water_texture.png');
  this.load.image('plainBuoy', 'assets/plainBuoy.png');
}


function create() {
  // Build the world:
  this.matter.world.setBounds(0, 0, bW, bH);

  // BEB - Sets up random wind and tide as "gravity" on the X,Y access.
  // Isn't very realistic as both create a vector, but should each have
  // there own vectors and then have them added together. This is an 
  // area for improvment for sure. 
  let wind = (Math.random() * (windConstraints[1] - windConstraints[0]) + windConstraints[0]);
  let tide = (Math.random() * (tideContstraints[1] - tideContstraints[0]) + tideContstraints[0])
  this.matter.world.setGravity(wind, tide);
  this.matter.world.setGravity(wind, tide);


  // Build the background:
  // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.TileSprite.html
  // waterTexture = this.add.tileSprite(config.width / 2, config.height / 2, config.width, config.height, 'waterTexture');

  for (let x = 0; x <= config.boardScale; x++) {
    for (let y = 0; y <= config.boardScale; y++) {
      this.add.image(config.width * x, config.height * y, 'waterTexture').setOrigin(0, 0);
    }
  }

  // Build starting gate with sensor.
  // place to static starting buoys.
  // place a sensor rectangle between them.
  // watch for when the player1 object interacts with the sensor.
  let startingBuoyPort = this.matter.add.sprite((bW / 2) - 100, (bH - 200), 'plainBuoy', null, {
    isStatic: true
  });
  let startingBuoyStarboard = this.matter.add.sprite((bW / 2) + 100, (bH - 200), 'plainBuoy', null, {
    isStatic: true
  });
  startingBuoyPort.flipX = true;
  startingBuoyPort.flipY = true;
  startingBuoyStarboard.flipX = true;
  startingBuoyStarboard.flipY = true;


  let endingBuoyPort = this.matter.add.sprite((bW / 2) - 100, 200, 'plainBuoy', null, {
    isStatic: true
  });
  let endingBuoyStarboard = this.matter.add.sprite((bW / 2) + 100, 200, 'plainBuoy', null, {
    isStatic: true
  });
  endingBuoyPort.flipX = true;
  endingBuoyPort.flipY = true;
  endingBuoyStarboard.flipX = true;
  endingBuoyStarboard.flipY = true;

  // the x coord here seems to centered in the rect.
  let startingGateSensor = this.matter.add.rectangle(((bW / 2)), (bH - 200), 200, 40, {
    isSensor: true,
    label: 'startingGate',
    isStatic: true
  });

  startingGateSensor.fillStyle = 0xff0000;


  // Manage all collisions:
  this.matter.world.on('collisionstart', function (event) {
    let collPairs = event.pairs;

    console.log(`${collPairs}`);

    for (let i = 0; i < collPairs.length; i++) {
      let pair = collPairs[i];
      pair.bodyA.render.fillStyle = 0xff0000;
      pair.bodyB.render.fillStyle = 0xff0000;

      // isSensor
      switch (true) {
        case (collPairs[i].isSensor):
          console.log(`Start or finishing gate crossed.`);
          break;
          // buoy
        case (!collPairs[i].isSensor):
          console.log(`Doh! Those don't move...`);
          break;
          // other vessel
        default:
          console.log(`Watch where your going noob!!`);
          break;
      }


    }
  });



  // Build player boat.
  player1 = this.matter.add.image(bW / 2, bH - 100, 'powerBoat');
  // player1.setFixedRotation(0); // BEB - It's unclear what
  player1.angle = -90;
  player1.setFrictionAir(0.15);
  player1.setMass(30);
  player1.setFixedRotation(0); // BEB - It's unclear what this is doing...
  tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
  tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);



  // Build sailTargets
  // TODO - copy powerTargets and modify.




  // // Build staticTargets
  // let plainBuoys = [];
  // for (let i = 0; i < 10; i++) {

  //   plainBuoys[i] = this.matter.add.sprite(getRand(0, config.width * 2, 'int'), getRand(0, config.height * 2, 'int'), 'plainBuoy', null, {
  //     isStatic: true,
  //   });
  //   plainBuoys[i].flipX = true;
  //   plainBuoys[i].flipY = true;
  // }


  // Build navAids (red/green marker buoys)
  // TODO


  // Build powerTargets
  for (let i = 0; i < 5; i++) {
      powerTargets[i] = this.matter.add.image(getRand(0, config.width * 2, 'int'), getRand(0, config.height * 2, 'int'), 'powerBoat', null, {
          // isStatic: true,
      });
      // powerTargets[i].flipX = true;
      // powerTargets[i].flipY = true;
      powerTargets[i].angle = getRand(0,360,'int');
      powerTargets[i].setFrictionAir(0.15);
      powerTargets[i].setMass(30);
  }



  // Setup the camera to follow:
  this.cameras.main.setBounds(0, 0, bW, bH);
  this.cameras.main.startFollow(player1);
  this.cameras.main.followOffset.set(0, 0); // unnecessary?


  this.add.text(0, 0, 'Hello World', {
    fontFamily: '"Roboto Condensed"'
  });

  // use default cursor keys
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  /* 
  // Trying to create a more realistic turn. 
  let point1 = player1.getTopRight();
  let point2 = player1.getBottomRight();    

  tracker1.setPosition(point1.x, point1.y);
  tracker2.setPosition(point2.x, point2.y);

  let speed = 0.10;
  if (cursors.left.isDown) {
      player1.applyForceFrom({ x: point1.x, y: point1.y }, { x: -speed * Math.cos(player1.body.angle), y: .5 });
  } else if (cursors.right.isDown) {
      player1.applyForceFrom({ x: point2.x, y: point2.y }, { x: speed * Math.cos(player1.body.angle), y: .5 });
  }
  */
  //    game.debug.cameraInfo(game.camera, 20, 20);

  let point1 = player1.getTopRight();
  let point2 = player1.getBottomRight();
  tracker1.setPosition(point1.x, point1.y);
  tracker2.setPosition(point2.x, point2.y);


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
  });
  // this.matter.world.setBounds(player1.x - game.width/2, player1.y - game.height/2, game.width, game.height);

}