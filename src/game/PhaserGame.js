import Phaser from 'phaser';
import Level1 from './scenes/Level1';
import { useEffect, useRef } from 'react';

export default function PhaserGame() {
  const gameContainerRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 } }
      },
      scene: [Level1],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    const game = new Phaser.Game(config);
    window.game = game;

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameContainerRef} style={{ width: '100%', height: '100%' }} />;
}