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
let backgroundTexture;
let explosion;
let resultsCamera;

const boardScale = 3;
const bW = config.width * boardScale;
const bH = config.height * boardScale;

let plainBuoys = [];
const numPlainBuoys = 20;

let powerTargets = [];
const numPowerTargets = 10;

let cursors;

const tideContstraints = [-0.3, 0.3];
const windConstraints = [-0.3, 0.3];

const raceTimerStart = -35; //increment by time... 
let raceTimer = raceTimerStart;
let timerInterval;

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