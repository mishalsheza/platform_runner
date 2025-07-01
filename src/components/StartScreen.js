export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1>Welcome to Platform Runner!</h1>
      <button onClick={onStart}>Start Game</button>
    </div>
  );
}
