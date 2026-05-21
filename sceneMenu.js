class sceneMenu extends Phaser.Scene {
    constructor() {
        super('sceneMenu');
    }

    preload() {
        // Load images
        this.load.image('bgMenu', 'asset shooter/BG1.png');
        this.load.image('bgPilih', 'asset shooter/BGPilihPesawat.png');
        this.load.image('bgPlay', 'asset shooter/BGPlay.png');
        this.load.image('title', 'asset shooter/Title.png');

        this.load.image('btnPlay', 'asset shooter/ButtonPlay.png');
        this.load.image('btnMenu', 'asset shooter/ButtonMenu.png');

        this.load.image('hero1', 'asset shooter/Pesawat1.png');
        this.load.image('hero2', 'asset shooter/Pesawat2.png');

        this.load.image('enemy1', 'asset shooter/Musuh1.png');
        this.load.image('enemy2', 'asset shooter/Musuh2.png');
        this.load.image('enemy3', 'asset shooter/Musuh3.png');
        this.load.image('enemyBoss', 'asset shooter/MusuhBos.png');

        this.load.image('bullet', 'asset shooter/Peluru.png');
        this.load.image('explode', 'asset shooter/EfekLedakan.png');
        this.load.image('cloud', 'asset shooter/cloud.png');

        // Load audio
        this.load.audio('musicMenu', 'asset shooter/music_menu.mp3');
        this.load.audio('musicPlay', 'asset shooter/music_play.mp3');
        this.load.audio('musicGameOver', 'asset shooter/music_gameover.mp3');
        this.load.audio('fxShoot', 'asset shooter/fx_shoot.mp3');
        this.load.audio('fxExplode', 'asset shooter/fx_explode.mp3');
    }

    create() {
        // Audio Management
        if (!this.sound.get('musicMenu')) {
            this.musicMenu = this.sound.add('musicMenu', { loop: true, volume: 0.4 });
            this.musicMenu.play();
        } else if (!this.sound.get('musicMenu').isPlaying) {
            this.sound.get('musicMenu').play();
        }

        // Letakkan background tepat di tengah (400, 300) dan atur ukurannya agar pas
        let bg = this.add.image(400, 300, 'bgMenu').setOrigin(0.5);
        bg.displayWidth = 800;
        bg.displayHeight = 600;

        // Judul Game pas di tengah atas
        this.add.image(400, 220, 'title').setOrigin(0.5).setScale(0.7);

        // Tombol Start pas di tengah bawah
        let startBtn = this.add.image(400, 430, 'btnPlay').setOrigin(0.5).setInteractive().setScale(0.6);

        // Pindah ke scene Pilih Hero saat diklik
        startBtn.on('pointerdown', () => {
            let menuMusic = this.sound.get('musicMenu');
            if (menuMusic) menuMusic.stop();
            this.scene.start('scenePilihHero');
        });

        // Animasi hover tombol
        startBtn.on('pointerover', () => startBtn.setScale(0.65));
        startBtn.on('pointerout', () => startBtn.setScale(0.6));
    }
}