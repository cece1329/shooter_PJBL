class sceneGameOver extends Phaser.Scene {
    constructor() {
        super('sceneGameOver');
    }

    init(data) {
        this.finalScore = data.finalScore || 0;
    }

    create() {
        // Play Audio Game Over
        this.music = this.sound.add('musicGameOver', { loop: true, volume: 0.4 });
        this.music.play();

        // Background pas tengah
        let bg = this.add.image(400, 300, 'bgMenu').setOrigin(0.5);
        bg.displayWidth = 800;
        bg.displayHeight = 600;

        // Teks Game Over
        this.add.text(400, 200, 'GAME OVER', {
            fontSize: '52px', fill: '#ff0000', fontStyle: 'bold', stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5);

        // Skor Akhir
        this.add.text(400, 280, 'Skor Akhir: ' + this.finalScore, {
            fontSize: '26px', fill: '#fff', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        // Tombol Menu / Restart (Pakai aset btnMenu kamu)
        let restartBtn = this.add.image(400, 420, 'btnMenu').setOrigin(0.5).setInteractive().setScale(0.6);

        // Event Klik Kembali ke Menu Utama
        restartBtn.on('pointerdown', () => {
            this.music.stop();
            this.scene.start('sceneMenu');
        });

        // Efek hover tombol
        restartBtn.on('pointerover', () => restartBtn.setScale(0.65));
        restartBtn.on('pointerout', () => restartBtn.setScale(0.6));
    }
}