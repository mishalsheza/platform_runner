import Phaser from 'phaser'
export default class Level2 extends Phaser.Scene {
  constructor() {
    super("Level2");
  }

  preload() {
    this.load.image("box", "assets/objects/box.png");
    this.load.image("switch", "assets/objects/switch.png");
  }

  create() {
    // Create platforms (reuse from Level1)
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

    // Box
    this.box = this.physics.add.sprite(300, 500, "box");
    this.physics.add.collider(this.player, this.box);
    this.physics.add.collider(this.box, this.platforms);

    // Switch
    this.switch = this.physics.add.staticSprite(500, 550, "switch");

    // Game state tracking
    this.boxOnSwitch = false;
    this.physics.add.overlap(this.box, this.switch, () => {
      this.boxOnSwitch = true;
      if (!this.exit) {
        this.exit = this.physics.add.sprite(700, 500, "exit");
        this.physics.add.overlap(this.player, this.exit, () => {
          this.scene.start("Level3");
        });
      }
    });

    // Update game state
    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.game.events.emit("GAME_UPDATE", {
          level: 2,
          position: { x: this.player.x, y: this.player.y },
          boxOnSwitch: this.boxOnSwitch,
        });
      },
      loop: true,
    });
  }
}
