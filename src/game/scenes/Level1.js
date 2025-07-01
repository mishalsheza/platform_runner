import Phaser from "phaser";

export default class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
  }

  preload() {
    this.load.image("background", "/assets/platforms/bg.png");
    this.load.image("groundLayer", "/assets/platforms/ground_layer.png");
    this.load.spritesheet("player", "/assets/characters/player.png", {
      frameWidth: 72,
      frameHeight: 97,
    });
    this.load.image("box", "/assets/objects/box.png");
    this.load.image("key", "/assets/objects/key.png");
  }

  create() {
    this.keysCollected = 0;
    this.keySprites = []; // Stores multiple keys

    const { width, height } = this.scale;
    const groundHeight = height / 3;
    const groundY = height - groundHeight;

    this.riddleTriggered = false;
    this.hasKey = false;
    this.keyAttached = false;
    this.currentBoxId = null;
    this.currentRiddleLevel = null;

    // Add background
    this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setDisplaySize(width, height);

    // Ground
    const ground = this.physics.add
      .staticImage(0, groundY, "groundLayer")
      .setOrigin(0, 0)
      .setDisplaySize(width, groundHeight)
      .refreshBody();

    // Player
    const playerStartY = groundY - 100;
    this.player = this.physics.add.sprite(
      width / 5 - 100,
      playerStartY,
      "player"
    );
    this.player.setBounce(0.2).setCollideWorldBounds(true);
    this.physics.add.collider(this.player, ground);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Box config
    const boxDataList = [
      { id: "box1", label: "Riddle 1", x: width / 3 - 100 },
      { id: "box2", label: "Riddle 2", x: width / 2 },
      { id: "box3", label: "Riddle 3", x: (2 * width) / 3 },
    ];

    const canvasBounds = this.game.canvas.getBoundingClientRect();

    boxDataList.forEach((data, index) => {
      const box = this.physics.add
        .staticImage(data.x, groundY, "box")
        .setOrigin(0.5, 1)
        .setScale(1.5);

      this.physics.add.collider(this.player, box);
      this.physics.add.overlap(this.player, box, () => {
        if (!this.riddleTriggered) this.handleRiddle(data.id, index + 1);
      });

      this[data.id] = box;

      // Create DOM button
      const button = document.createElement("button");
      button.id = `${data.id}-button`;
      button.textContent = data.label;
      button.style.position = "absolute";
      button.style.left = `${canvasBounds.left + data.x - 44}px`;
      button.style.top = `${canvasBounds.top + groundY - 100}px`;
      button.style.zIndex = 10;
      document.body.appendChild(button);

      button.onclick = () => this.handleRiddle(data.id, index + 1);
    });
  }

  handleRiddle(boxId, level) {
    if (this.riddleTriggered) return;

    console.log(`Riddle ${level} triggered ✅`);
    this.riddleTriggered = true;
    this.currentBoxId = boxId;
    this.currentRiddleLevel = level;

    this.physics.pause();
    this.scene.pause();

    // Hide only the current button
    const currentButton = document.getElementById(`${boxId}-button`);
    if (currentButton) currentButton.style.display = "none";

    // Set dynamic riddle text
    const riddleQuestion = document.getElementById("riddle-question");
    if (riddleQuestion) {
      riddleQuestion.textContent = this.getRiddleText(level);
    }

    const popup = document.getElementById("riddle-popup");
    if (popup) popup.style.display = "block";

    // Clear previous answer
    const answerInput = document.getElementById("riddle-answer");
    if (answerInput) {
      answerInput.value = "";
    }

    const feedback = document.getElementById("riddle-feedback");
    if (feedback) {
      feedback.textContent = "";
    }
  }
  getRiddleText(level) {
    const riddles = {
      1: "What has to be broken before you can use it?",
      2: "I speak without a mouth and hear without ears. What am I?",
      3: "The more you take, the more you leave behind. What are they?",
    };
    return riddles[level] || "Riddle not found.";
  }

  handleRiddleSuccess(boxId, level) {
    const box = this[boxId];
    if (box) box.destroy();

    const button = document.getElementById(`${boxId}-button`);
    if (button) button.style.display = "none";

    this.keysCollected += 1;

    // ✅ Create and attach new key sprite to player
    const offsetX = 20 + this.keySprites.length * 25; // Space out keys
    const newKey = this.add
      .image(this.player.x + offsetX, this.player.y - 40, "key")
      .setScale(0.5);
    this.keySprites.push(newKey);

    this.scene.resume();
    this.physics.resume();
    this.riddleTriggered = false;
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    // Update positions of all keys attached to the player
    this.keySprites.forEach((keySprite, index) => {
      const offsetX = 20 + index * 25;
      keySprite.setPosition(this.player.x + offsetX, this.player.y - 40);
    });
  }
}
