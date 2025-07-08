import { useState } from "react";
import StartScreen from "./components/StartScreen";
import PhaserGame from "./game/PhaserGame";
import RiddleHintBot from "./components/RiddleHintBot"; // ✅ Updated import
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

      {/* 🧠 DinoBot assistant for riddles only */}
      <RiddleHintBot />  {/* ✅ This replaces <AIChat /> */}
    </div>
  );
}

export default App;
