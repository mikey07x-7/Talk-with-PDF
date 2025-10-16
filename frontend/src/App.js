import React, { useState, useRef, useEffect } from "react";
import "./index.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  // 📄 Upload PDF
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { sender: "System", text: `✅ ${data.message}` },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "System", text: "⚠️ Error uploading PDF." },
      ]);
    } finally {
      setUploading(false);
    }
  };

  // 💬 Ask question
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      const aiMessage = { sender: "AI", text: data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "⚠️ Could not reach backend." },
      ]);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-box glass-card">
        <h2 className="title">📄 Talk with PDF</h2>

        <div className="upload-section">
          <label htmlFor="pdf-upload" className="upload-btn">
            {uploading ? "⏳ Analyzing..." : "📤 Upload PDF"}
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            hidden
          />
          {fileName && <p className="file-name">📘 {fileName}</p>}
        </div>

        <div className="messages" ref={chatRef}>
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.sender.toLowerCase()}`}>
              <strong>{m.sender}:</strong> {m.text}
            </div>
          ))}
        </div>

        <div className="input-box">
          <input
            type="text"
            placeholder="Ask about the PDF..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
