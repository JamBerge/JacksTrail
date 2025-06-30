
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: { preload, create, update }
};

let player;
let trees;
let sasquatch;
let score = 0;
let scoreText;
let gameOver = false;
let chopKey;

const game = new Phaser.Game(config);

function preload () {
    this.load.image('background', 'https://labs.phaser.io/assets/skies/forest.png');
    this.load.image('tree', 'https://labs.phaser.io/assets/sprites/tree.png');
    this.load.spritesheet('jack', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('sasquatch', 'https://labs.phaser.io/assets/sprites/enemy-bullet.png');
}

function create () {
    this.add.image(400, 225, 'background').setScale(2);

    player = this.physics.add.sprite(150, 360, 'jack').setScale(1.5);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('jack', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    player.play('run');

    trees = this.physics.add.group();
    sasquatch = this.add.image(-100, 360, 'sasquatch').setScale(2);

    scoreText = this.add.text(16, 16, 'Wood Collected: 0', { fontSize: '24px', fill: '#fff' });

    chopKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.on('pointerdown', chopTree, this);

    this.time.addEvent({ delay: 2000, callback: spawnTree, callbackScope: this, loop: true });
}

function update () {
    if (gameOver) return;

    trees.children.iterate(function (tree) {
        tree.x -= 4;
        if (tree.x < -50) {
            tree.destroy();
            sasquatch.x += 30;
            if (sasquatch.x > player.x - 30) {
                gameOver = true;
                scoreText.setText('Game Over! Wood: ' + score);
            }
        }
    });

    if (Phaser.Input.Keyboard.JustDown(chopKey)) {
        chopTree.call(this);
    }
}

function spawnTree () {
    let tree = trees.create(800, 360, 'tree').setScale(0.3);
    tree.setImmovable(true);
}

function chopTree () {
    let closest = trees.getChildren().find(tree => tree.x < player.x + 50 && tree.x > player.x - 50);
    if (closest) {
        closest.destroy();
        score += 1;
        scoreText.setText('Wood Collected: ' + score);
    }
}
