import { useState } from "react";
import StartScreen from "./components/StartScreen";
import PhaserGame from "./game/PhaserGame";
import AIChat from "./components/AIChat";
import "./styles/Game.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="app">
      {!gameStarted ? (
        <StartScreen onStart={() => setGameStarted(true)} />
      ) : (
        <PhaserGame />
        
      )}
      <AIChat gameState={{ level: 1 }} />

    </div>
  );
}

export default App;
