
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1000 }, debug: false }
    },
    scene: { preload, create, update }
};

let player;
let cursors;
let ground;
let sasquatch;
let gameOver = false;
let score = 0;
let scoreText;

const game = new Phaser.Game(config);

function preload () {
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('forest', 'https://labs.phaser.io/assets/skies/forest.png');
    this.load.spritesheet('jack', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create () {
    this.add.image(400, 225, 'forest').setScale(2);
    ground = this.physics.add.staticGroup();
    ground.create(400, 430, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 360, 'jack');
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('jack', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    player.play('run');
    cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', jump, this);

    this.physics.add.collider(player, ground);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });

    // Sasquatch placeholder: red rectangle
    sasquatch = this.add.rectangle(-50, 360, 40, 80, 0xff0000);
}

function update () {
    if (gameOver) return;

    if (cursors.up.isDown && player.body.touching.down) {
        jump.call(this);
    }

    score += 0.05;
    scoreText.setText('Score: ' + Math.floor(score));

    sasquatch.x += 0.4;

    if (sasquatch.x > player.x - 30) {
        this.physics.pause();
        gameOver = true;
        scoreText.setText('Game Over! Final Score: ' + Math.floor(score));
    }
}

function jump() {
    if (player.body.touching.down) {
        player.setVelocityY(-500);
    }
}
