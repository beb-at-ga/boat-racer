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
            debug: true,
            // debugShowBody: true,
            // debugShowVelocity: true,
            // debugWireframes: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },

};

let powerBoat;
let waterTexture;
let cursors;
let tideContstraints = [-0.3, 0.3]
let windConstraints = [-0.3, 0.3]

let game = new Phaser.Game(config);

// BEB - leave preload, create, and update as fn declarations. 
function preload() {
    this.load.image('powerBoat', 'assets/yacht.png');
    this.load.image('waterTexture', 'assets/water_texture.png');
}

function create() {
    // Build the world:

    // BEB - Sets up random wind and tide as "gravity" on the X,Y access.
    // Isn't very realistic as both create a vector, but should each have
    // there own vectors and then have them added together. This is an 
    // area for improvment for sure. 
    let wind = (Math.random() * (windConstraints[1] - windConstraints[0]) + windConstraints[0]);
    let tide = (Math.random() * (tideContstraints[1] - tideContstraints[0]) + tideContstraints[0])
    this.matter.world.setGravity(wind, tide);

    this.matter.world.setBounds(0, 0, config.width * 2, config.height * 2);
    
    // Build the background:
    // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.TileSprite.html
    // waterTexture = this.add.tileSprite(config.width / 2, config.height / 2, config.width, config.height, 'waterTexture');

    // I dopn't like this! Pasting images together?!? Gross. Work out the tileSprite...
    this.add.image(0, 0, 'waterTexture').setOrigin(0);
    this.add.image(config.width, 0, 'waterTexture').setOrigin(0);
    this.add.image(0, config.height, 'waterTexture').setOrigin(0);
    this.add.image(config.width, config.height, 'waterTexture').setOrigin(0);

    // waterTexture.transform.scale(config.width);       
    // waterTexture.setTileScale(1024, 768);




    // Build the main boat
    powerBoat = this.matter.add.image(400, 300, 'powerBoat');
    powerBoat.setFrictionAir(0.15);
    powerBoat.setMass(30);
    powerBoat.setFixedRotation(0);  // BEB - It's unclear what this is doing...

    tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
    tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);


    // Setup the camera:

    // let randomWidth = 1024;
    // let randomHeight = 768;
    // // this.matter.world.setBounds(0, 0, config.width, config.height);
    // this.matter.world.setBounds(0, 0, randomWidth, randomHeight);
    // this.matter.world.setBounds(-randomWidth/2, -randomHeight/2, randomWidth, randomHeight);
    this.cameras.main.setBounds(0, 0, config.width * 2, config.height * 2);
    this.cameras.main.startFollow(powerBoat);
    this.cameras.main.followOffset.set(0, 0);  // unnecessary?

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
//    game.debug.cameraInfo(game.camera, 20, 20);
   
    let point1 = powerBoat.getTopRight();
    let point2 = powerBoat.getBottomRight();

    tracker1.setPosition(point1.x, point1.y);
    tracker2.setPosition(point2.x, point2.y);

    if (cursors.left.isDown) {
        powerBoat.setAngularVelocity(-0.2);
    } else if (cursors.right.isDown) {
        powerBoat.setAngularVelocity(0.02);
    }
    if (cursors.up.isDown) {
        powerBoat.thrust(0.75);
    }

    // this.matter.world.setBounds(powerBoat.x - game.width/2, powerBoat.y - game.height/2, game.width, game.height);

}