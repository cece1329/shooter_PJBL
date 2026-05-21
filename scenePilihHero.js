class scenePilihHero extends Phaser.Scene {
    constructor() {
        super('scenePilihHero');
    }

    create() {
        // Set background agar pas di tengah layar
        let bg = this.add.image(400, 300, 'bgPilih').setOrigin(0.5);
        bg.displayWidth = 800;
        bg.displayHeight = 600;

        this.add.text(400, 80, 'PILIH HERO KAMU', {
            fontSize: '36px', fill: '#fff', fontStyle: 'bold', stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5);

        // Opsi Hero 1 (Striker) - Posisi kiri seimbang
        let opt1 = this.add.image(270, 300, 'hero1').setInteractive().setScale(0.55);
        this.add.text(270, 410, 'STRIKER', { fontSize: '22px', fill: '#00ffff', fontStyle: 'bold', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5);

        // Opsi Hero 2 (Blaster) - Posisi kanan seimbang
        let opt2 = this.add.image(530, 300, 'hero2').setInteractive().setScale(0.55);
        this.add.text(530, 410, 'BLASTER', { fontSize: '22px', fill: '#ff00ff', fontStyle: 'bold', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5);

        // Efek hover tombol pesawat
        opt1.on('pointerover', () => opt1.setScale(0.62));
        opt1.on('pointerout', () => opt1.setScale(0.55));
        opt2.on('pointerover', () => opt2.setScale(0.62));
        opt2.on('pointerout', () => opt2.setScale(0.55));

        // Event Klik kirim tipe hero ke gameplay
        opt1.on('pointerdown', () => this.scene.start('scenePlay', { heroType: 'hero1' }));
        opt2.on('pointerdown', () => this.scene.start('scenePlay', { heroType: 'hero2' }));
    }
}