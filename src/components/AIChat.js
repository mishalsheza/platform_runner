import { useState } from "react";
import { FaRobot, FaPaperPlane, FaComments } from "react-icons/fa";
import "../styles/AIChat.css";

export default function AIChat({ gameState }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm your game helper. Ask me if you get stuck!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("YOUR_AI_API_ENDPOINT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          gameState: {
            ...gameState,
            levelHint: getLevelHint(gameState.level),
          },
        }),
      });

      const aiResponse = await response.json();
      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse.text }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Oops! I'm having trouble helping right now. Try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelHint = (level) => {
    const hints = {
      1: "Focus on jumping between platforms using the UP arrow key.",
      2: "Push the box onto the switch to reveal the exit.",
      3: "Find and collect the key to unlock the door.",
    };
    return hints[level] || "Explore and try different actions!";
  };

  return (
    <div className="ai-wrapper">
      <button className="ai-toggle" onClick={() => setIsOpen(!isOpen)}>
        <FaComments size={24} />
      </button>

      {isOpen && (
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.sender === "ai" && <FaRobot className="icon" />}
                <p>{msg.text}</p>
              </div>
            ))}
            {isLoading && (
              <div className="message ai">
                <FaRobot className="icon" />
                <p>Thinking...</p>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask for help..."
            />
            <button onClick={handleSend}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
