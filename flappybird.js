var game = new Phaser.Game(480, 320, Phaser.AUTO, 'gameDiv');
var mainState = {
    preload: function () {
        game.stage.backgroundColor = '#71c5cf';
        game.load.image('bird', 'bird.png');
        game.load.image('pipe', 'pipe.png');
        game.load.audio('jump', 'jump.mp3');
        game.load.audio('dead', 'dead.mp3');
    }
    , create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);
        this.bird = this.game.add.sprite(100, 160, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        this.bird.anchor.setTo(-0.2, 0.5);
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        this.game.input.onDown.add(this.jump, this);
        this.score = -1;
        this.labelScore = this.game.add.text(20, 20, "0", {
            font: "30px Arial"
            , fill: "#ffffff"
        });
        this.jumpSound = this.game.add.audio('jump');
        this.deadSound = this.game.add.audio('dead');
    }
    , update: function () {
        if (this.bird.inWorld == false) this.restartGame();
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        if (this.bird.angle < 20) this.bird.angle += 1;
    }
    , jump: function () {
        if (this.bird.alive == false) return;
        this.bird.body.velocity.y = -350;
        game.add.tween(this.bird).to({
            angle: -20
        }, 100).start();
        this.jumpSound.play();
    }
    , hitPipe: function () {
        if (this.bird.alive == false) return;
        this.bird.alive = false;
        this.game.time.events.remove(this.timer);
        this.pipes.forEachAlive(function (p) {
            p.body.velocity.x = 0;
        }, this);
        this.deadSound.play();
    }
    , restartGame: function () {
        game.state.start('main');
    }
    , addOnePipe: function (x, y) {
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.x = -200;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }
    , addRowOfPipes: function () {
        var hole = Math.floor(Math.random() * 4) + 1;
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1 && i != hole + 2) this.addOnePipe(480, i * 40);
        this.score += 1;
        this.labelScore.text = this.score;
    }
, };
game.state.add('main', mainState);
game.state.start('main');