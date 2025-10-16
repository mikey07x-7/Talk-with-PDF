import React, { useState, useRef } from "react";
import "./ChatUI.css";   // ✅ required to load styles

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { text: "✅ System ready — upload your PDF to begin.", type: "system" },
  ]);
  const [fileName, setFileName] = useState("");
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      addMessage(`✅ ${file.name} uploaded successfully.`, "system");
      // TODO: integrate backend PDF upload here
    }
  };

  const addMessage = (text, type) => {
    setMessages((prev) => [...prev, { text, type }]);
    setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    addMessage(input, "user");
    setInput("");

    // Show loading message
    const loadingId = Date.now();
    setMessages((prev) => [...prev, { id: loadingId, text: "⏳ Thinking...", type: "ai" }]);

    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();

      // Replace loading with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId ? { text: data.answer || "⚠️ No response", type: "ai" } : msg
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId ? { text: "⚠️ Server error", type: "ai" } : msg
        )
      );
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-card">
        <h1>📄 Talk with PDF</h1>

        <div className="upload-section">
          <label htmlFor="file-upload" className="upload-btn">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upload PDF
          </label>
          <input id="file-upload" type="file" hidden onChange={handleFileChange} />
          <span className="file-name">{fileName}</span>
        </div>

        <div className="chat-box" ref={chatRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`message ${m.type}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="input-section">
          <input
            type="text"
            placeholder="Ask about the PDF..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
