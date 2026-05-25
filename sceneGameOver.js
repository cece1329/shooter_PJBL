var sceneGameOver = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function () {
    Phaser.Scene.call(this, { key: "sceneGameOver" });
  },

  init: function (data) {
    this.score = data.score || 0;
    this.newRecord = false;
    console.log("Score masuk ke GameOver:", this.score);
  },

  preload: function () {
    this.load.setBaseURL("assets/");
    this.load.image("BGPlay", "images/BGPlay.png");
    this.load.image("ButtonPlay", "images/ButtonPlay.png");
    this.load.audio("snd_gameover", "audio/music_gameover.mp3");
    this.load.audio("snd_touchshooter", "audio/fx_touch.mp3");
    this.load.audio("snd_newrecord", "audio/fx_newrecord.mp3");
  },

  create: function () {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const bg = this.add.image(centerX, centerY, "BGPlay").setDisplaySize(540, 960); // Disesuaikan untuk potret baru
    bg.setTint(0x666666);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.4);
    overlay.fillRect(0, 0, this.scale.width, this.scale.height);

    // Ambil Best Score
    let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
    if (this.score > bestScore) {
      this.newRecord = true;
      bestScore = this.score;
      localStorage.setItem("bestScore", bestScore);
    }

    // Suara
    this.sound.play(this.newRecord ? "snd_newrecord" : "snd_gameover");

    // Buat Panel Utama
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.8);
    panel.fillRoundedRect(centerX - 220, centerY - 300, 440, 600, 30);
    panel.lineStyle(6, 0xffffff, 1);
    panel.strokeRoundedRect(centerX - 220, centerY - 300, 440, 600, 30);
    panel.setScale(0);

    this.tweens.add({
      targets: panel,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });

    this.createAnimatedTitle(centerX, centerY - 240);
    this.createScoreDisplay(centerX, centerY, bestScore);
    this.createRank(centerX, centerY + 20); // Tambahkan Rank
    this.createButtons(centerX, centerY + 180);
    this.createParticleEffects();

    this.tweens.add({
      targets: bg,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 8000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  },

  createAnimatedTitle: function (centerX, centerY) {
    const titleText = this.newRecord ? "MISSION COMPLETE" : "MISSION FAILED";
    const titleColor = this.newRecord ? "#ffff00" : "#ff4444";

    const title = this.add
      .text(centerX, centerY, titleText, { // Posisi Y disesuaikan dalam panggilan createAnimatedTitle
        font: "bold 42px Arial",
        fill: titleColor,
        stroke: "#ffffff",
        strokeThickness: 4,
        shadow: {
          offsetX: 4,
          offsetY: 4,
          color: "#000000",
          blur: 8,
          fill: true
        }
      })
      .setOrigin(0.5)
      .setScale(0)
      .setAlpha(0);

    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 800,
      ease: 'Back.easeOut',
      onComplete: () => {
        if (this.newRecord) {
          this.tweens.add({
            targets: title,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      }
    });
  },

  createScoreDisplay: function (centerX, centerY, bestScore) {
    const currentScore = this.add
      .text(centerX, centerY - 140, "FINAL SCORE", {
        font: "bold 20px Arial",
        fill: "#ffffff",
        align: 'center'
      })
      .setOrigin(0.5);

    const scoreValue = this.add
      .text(centerX, centerY - 90, "0", {
        font: "bold 64px Arial",
        fill: "#ffff00",
        align: 'center'
      })
      .setOrigin(0.5);

    const bestScoreLabel = this.add
      .text(centerX, centerY - 30, "BEST: " + bestScore, {
        font: "18px Arial",
        fill: "#cccccc",
        align: 'center'
      })
      .setOrigin(0.5);

    this.animateScoreCount(scoreValue, this.score);
  },

  createRank: function (centerX, centerY) {
    let grade = "C";
    let color = "#aaaaaa";

    if (this.score >= 50) { grade = "S"; color = "#ff00ff"; }
    else if (this.score >= 30) { grade = "A"; color = "#00ffff"; }
    else if (this.score >= 15) { grade = "B"; color = "#00ff00"; }

    const rankLabel = this.add.text(centerX, centerY, "RANK", {
      font: "bold 20px Arial",
      fill: "#ffffff"
    }).setOrigin(0.5).setAlpha(0);

    const rankText = this.add.text(centerX, centerY + 60, grade, {
      font: "bold 120px Arial",
      fill: color,
      stroke: "#ffffff",
      strokeThickness: 8
    }).setOrigin(0.5).setScale(4).setAlpha(0);

    this.time.delayedCall(1200, () => {
      rankLabel.setAlpha(1);
      this.tweens.add({
        targets: rankText,
        scale: 1,
        alpha: 1,
        duration: 400,
        ease: 'Bounce.easeOut'
      });
    });
  },

  animateScoreCount: function (textObject, targetScore) {
    this.tweens.add({
      targets: { value: 0 },
      value: targetScore,
      duration: 800,
      ease: 'Power2',
      onUpdate: function (tween) {
        textObject.setText(Math.floor(tween.getValue()).toString());
      }
    });
  },

  createButtons: function (centerX, centerY) {
    const buttonContainer = this.add.container(centerX, centerY);
    buttonContainer.setAlpha(0);

    const btnRestart = this.add.image(0, 0, "ButtonPlay").setInteractive().setScale(0.8);

    btnRestart.on('pointerover', () => {
      this.tweens.add({ targets: btnRestart, scaleX: 1.1, scaleY: 1.1, duration: 200 });
    });
    btnRestart.on('pointerout', () => {
      this.tweens.add({ targets: btnRestart, scaleX: 0.9, scaleY: 0.9, duration: 200 });
    });
    btnRestart.on("pointerdown", () => {
      this.sound.play("snd_touchshooter");
      this.tweens.add({
        targets: btnRestart,
        scaleX: 0.85,
        scaleY: 0.85,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          // Langsung memulai ulang game
          this.scene.start("scenePlay");
        }
      });
    });

    const btnMenu = this.add.text(0, 150, "MAIN MENU", { // Posisi Y disesuaikan relatif terhadap btnRestart
      font: "bold 24px Arial",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2,
      backgroundColor: "#333333",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    btnMenu.on('pointerover', () => {
      btnMenu.setFill("#ffff00");
      this.tweens.add({ targets: btnMenu, scaleX: 1.1, scaleY: 1.1, duration: 200 });
    });
    btnMenu.on('pointerout', () => {
      btnMenu.setFill("#ffffff");
      this.tweens.add({ targets: btnMenu, scaleX: 1, scaleY: 1, duration: 200 });
    });
    btnMenu.on("pointerdown", () => {
      this.sound.play("snd_touchshooter");
      this.scene.start("sceneMenu");
    });

    buttonContainer.add([btnRestart, btnMenu]); // Menambahkan btnRestart

    this.time.delayedCall(1200, () => {
      this.tweens.add({
        targets: buttonContainer,
        alpha: 1,
        y: buttonContainer.y - 20,
        duration: 600,
        ease: 'Back.easeOut'
      });
    });
  },

  createParticleEffects: function () {
    if (this.newRecord) {
      const emitter = this.add.particles(this.scale.width / 2, 100, 'ButtonPlay', {
        frame: [0, 1, 2, 3], // Mengasumsikan ButtonPlay mungkin memiliki frame atau menggunakan tekstur partikel generik
        scale: { start: 0.2, end: 0 }, // Partikel sedikit lebih besar
        speed: { min: 150, max: 300 }, // Partikel lebih cepat
        lifespan: 2500, // Umur lebih panjang
        quantity: 3, // Lebih banyak partikel
        blendMode: 'ADD',
        tint: [0xffff00, 0x00ff00, 0xff6600, 0xff0066, 0x00ffff] // Menambahkan lebih banyak warna
      });

      this.time.delayedCall(3000, () => {
        emitter.stop();
      });
    }

    for (let i = 0; i < 10; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(0xffffff, 0.1);
      particle.fillCircle(0, 0, Math.random() * 3 + 1);
      particle.x = Math.random() * this.scale.width;
      particle.y = Math.random() * this.scale.height;

      this.tweens.add({
        targets: particle,
        y: particle.y - 100,
        alpha: 0,
        duration: Math.random() * 3000 + 2000,
        delay: Math.random() * 2000,
        repeat: -1,
        onRepeat: () => {
          particle.y = this.scale.height + 50;
          particle.x = Math.random() * this.scale.width;
          particle.alpha = 0.1;
        }
      });
    }
  }
});
