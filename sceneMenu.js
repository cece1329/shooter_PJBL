class sceneMenu extends Phaser.Scene {
    constructor() {
        super('sceneMenu');
    }

    preload() {
        // Load images
        this.load.image('bgMenu', 'asset%20shooter/BG1.png');
        this.load.image('bgPilih', 'asset%20shooter/BGPilihPesawat.png');
        this.load.image('bgPlay', 'asset%20shooter/BGPlay.png');
        this.load.image('title', 'asset%20shooter/Title.png');

        this.load.image('btnPlay', 'asset%20shooter/ButtonPlay.png');
        this.load.image('btnMenu', 'asset%20shooter/ButtonMenu.png');

        this.load.image('hero1', 'asset%20shooter/Pesawat1.png');
        this.load.image('hero2', 'asset%20shooter/Pesawat2.png');

        this.load.image('enemy1', 'asset%20shooter/Musuh1.png');
        this.load.image('enemy2', 'asset%20shooter/Musuh2.png');
        this.load.image('enemy3', 'asset%20shooter/Musuh3.png');
        this.load.image('enemyBoss', 'asset%20shooter/MusuhBos.png');

        this.load.image('bullet', 'asset%20shooter/Peluru.png');
        this.load.image('explode', 'asset%20shooter/EfekLedakan.png');
        this.load.image('cloud', 'asset%20shooter/cloud.png');

        // Load audio
        this.load.audio('musicMenu', 'asset%20shooter/music_menu.mp3');
        this.load.audio('musicPlay', 'asset%20shooter/music_play.mp3');
        this.load.audio('musicGameOver', 'asset%20shooter/music_gameover.mp3');
        this.load.audio('fxShoot', 'asset%20shooter/fx_shoot.mp3');
        this.load.audio('fxExplode', 'asset%20shooter/fx_explode.mp3');
    }

    create() {
        // Audio Management - Volume dinaikkan ke 0.8 agar lebih kencang
        if (!this.sound.get('musicMenu')) {
            this.musicMenu = this.sound.add('musicMenu', { loop: true, volume: 0.8 });
            this.musicMenu.play();
        } else if (!this.sound.get('musicMenu').isPlaying) {
            this.sound.get('musicMenu').play();
        }

        let bg = this.add.image(400, 300, 'bgMenu').setOrigin(0.5);
        bg.displayWidth = 800;
        bg.displayHeight = 600;

        this.add.image(400, 220, 'title').setOrigin(0.5).setScale(0.7);

        let startBtn = this.add.image(400, 430, 'btnPlay').setOrigin(0.5).setInteractive().setScale(0.6);

        // Langsung pindah scene tanpa mematikan lagu agar tetap terdengar saat pilih hero
        startBtn.on('pointerdown', () => {
            this.scene.start('scenePilihHero');
        });

        startBtn.on('pointerover', () => startBtn.setScale(0.65));
        startBtn.on('pointerout', () => startBtn.setScale(0.6));
    }
}