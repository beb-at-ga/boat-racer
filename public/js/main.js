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
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let powerBoat;
let cursors;
let tideContstraints = [-0.3, 0.3]
let windConstraints = [-0.3, 0.3]

let game = new Phaser.Game(config);

// BEB - leave preload, create, and update as fn declarations. 
function preload() {
    this.load.image('powerBoat', 'assets/yacht.png');
}

function create() {

    powerBoat = this.matter.add.image(400, 300, 'powerBoat');

    powerBoat.setFrictionAir(0.15);
    powerBoat.setMass(30);
    // BEB - It's unclear what this is doing...
    powerBoat.setFixedRotation(0);


    // powerBoat.setAcceleration(4,4);


    this.matter.world.setBounds(0, 0, config.width, config.height);

    // BEB - Sets up random wind and tide as "gravity" on the X,Y access.
    // Isn't very realistic as both create a vector, but should each have
    // there own vectors and then have them added together. This is an 
    // area for improvment for sure. 
    let wind = (Math.random() * (windConstraints[1] - windConstraints[0]) + windConstraints[0]);
    let tide = (Math.random() * (tideContstraints[1] - tideContstraints[0]) + tideContstraints[0])
    // this.matter.world.setGravity(wind, tide);


    tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
    tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);


    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    /* 
    // Trying to create a more realistic turn. 
    let point1 = powerBoat.getTopRight();
    let point2 = powerBoat.getBottomRight();    

    tracker1.setPosition(point1.x, point1.y);
    tracker2.setPosition(point2.x, point2.y);

    let speed = 0.10;
    if (cursors.left.isDown) {
        powerBoat.applyForceFrom({ x: point1.x, y: point1.y }, { x: -speed * Math.cos(powerBoat.body.angle), y: .5 });
    } else if (cursors.right.isDown) {
        powerBoat.applyForceFrom({ x: point2.x, y: point2.y }, { x: speed * Math.cos(powerBoat.body.angle), y: .5 });
    }
    */

   let point1 = powerBoat.getTopRight();
   let point2 = powerBoat.getBottomRight();    

   tracker1.setPosition(point1.x, point1.y);
   tracker2.setPosition(point2.x, point2.y);    

    if (cursors.left.isDown) {
        powerBoat.setAngularVelocity(-0.015);
    } else if (cursors.right.isDown) {
        powerBoat.setAngularVelocity(0.015);
    }
    if (cursors.up.isDown) {
        powerBoat.thrust(0.02);
    }
}