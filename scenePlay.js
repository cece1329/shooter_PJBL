class scenePlay extends Phaser.Scene {
    constructor() {
        super('scenePlay');
    }

    init(data) {
        this.selectedHero = data.heroType || 'hero1';
    }

    create() {
        this.score = 0;
        this.lastFired = 0;

        // Background
        this.add.image(400, 300, 'bgPlay').setOrigin(0.5);

        // Audio Management
        this.music = this.sound.add('musicPlay', { loop: true, volume: 0.4 });
        this.music.play();
        this.fxShoot = this.sound.add('fxShoot', { volume: 0.25 });
        this.fxExplode = this.sound.add('fxExplode', { volume: 0.4 });

        // Kontrol Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W, down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Player (Ukuran pas & Optimasi Hitbox Fisik)
        this.player = this.physics.add.sprite(400, 300, this.selectedHero);
        this.player.setScale(0.5);
        this.player.setCollideWorldBounds(true);
        this.player.setDrag(1200);
        this.player.body.setCircle(this.player.width * 0.4, this.player.width * 0.1, this.player.height * 0.1);

        // Groups
        this.bullets = this.physics.add.group({ defaultKey: 'bullet', maxSize: 40 });
        this.enemies = this.physics.add.group();

        // UI Score
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff', stroke: '#000', strokeThickness: 4 });

        // Loop Spawning Musuh
        this.enemyTimer = this.time.addEvent({
            delay: 900, callback: this.spawnEnemy, callbackScope: this, loop: true
        });

        // Colliders
        this.physics.add.collider(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.collider(this.player, this.enemies, this.hitPlayer, null, this);
    }

    update(time) {
        if (!this.player.active) return;

        // Gerakan Player
        let speed = 320;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown || this.wasd.left.isDown) this.player.setVelocityX(-speed);
        else if (this.cursors.right.isDown || this.wasd.right.isDown) this.player.setVelocityX(speed);

        if (this.cursors.up.isDown || this.wasd.up.isDown) this.player.setVelocityY(-speed);
        else if (this.cursors.down.isDown || this.wasd.down.isDown) this.player.setVelocityY(speed);

        // Rotasi Mengikuti Arah Kursor Mouse
        let pointer = this.input.activePointer;
        let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
        this.player.setRotation(angle + Math.PI / 2);

        // Mekanik Tembak Beruntun
        if (pointer.isDown && time > this.lastFired) {
            this.fireBullet(this.player.x, this.player.y, angle);
            this.lastFired = time + 180;
        }

        // Hapus Peluru di Luar Layar
        this.bullets.children.each(b => {
            if (b.active && (b.y < -20 || b.y > 620 || b.x < -20 || b.x > 820)) {
                b.setActive(false); b.setVisible(false);
                b.body.stop();
            }
        });

        // Pergerakan AI Musuh
        this.enemies.children.each(enemy => {
            if (enemy.active) {
                this.physics.moveToObject(enemy, this.player, 130);
                let enemyAngle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                enemy.setRotation(enemyAngle - Math.PI / 2);
            }
        });
    }

    fireBullet(x, y, angle) {
        let bullet = this.bullets.get(x, y);
        if (bullet) {
            bullet.setActive(true).setVisible(true);
            bullet.setScale(0.4); // Mengatur skala peluru
            bullet.setRotation(angle + Math.PI / 2);
            bullet.body.setSize(bullet.width * 0.5, bullet.height * 0.5);

            this.physics.velocityFromRotation(angle, 700, bullet.body.velocity);
            this.fxShoot.play();
        }
    }

    spawnEnemy() {
        let x, y;
        if (Phaser.Math.Between(0, 1) === 0) {
            x = Phaser.Math.Between(0, 800);
            y = Phaser.Math.Between(0, 1) === 0 ? -40 : 640;
        } else {
            x = Phaser.Math.Between(0, 1) === 0 ? -40 : 840;
            y = Phaser.Math.Between(0, 600);
        }

        const enemyTypes = ['enemy1', 'enemy2', 'enemy3'];
        const randomType = Phaser.Math.RND.pick(enemyTypes);

        let enemy = this.enemies.create(x, y, randomType);
        enemy.setScale(0.45);
        enemy.body.setCircle(enemy.width * 0.35);
    }

    hitEnemy(bullet, enemy) {
        bullet.setActive(false).setVisible(false).body.stop();

        let explosion = this.add.image(enemy.x, enemy.y, 'explode').setScale(0.6);
        this.time.delayedCall(120, () => explosion.destroy());
        this.fxExplode.play();

        enemy.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    hitPlayer(player, enemy) {
        this.physics.pause();
        this.enemyTimer.remove();
        this.music.stop();

        let explosion = this.add.image(player.x, player.y, 'explode').setScale(1.2);
        this.fxExplode.play();

        player.setActive(false).setVisible(false);

        this.time.delayedCall(1000, () => {
            this.scene.start('sceneGameOver', { finalScore: this.score });
        });
    }
}