import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { IoSend } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { api } from "../api";
import "../styles/chat.css"

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

 useEffect(() => {
  const loadHistory = async () => {
    const data = await api.history();

    const formatted = data.map((msg) => ({
      role: msg.role,
      text: msg.message
    }));

    setMessages(formatted);
  };

  loadHistory();
}, []);

  // 📄 Upload PDF
  const uploadFile = async () => {
  if (!file) return alert("Select file");

  await api.upload(file);
  alert("Uploaded ✅");
};

  // 💬 Send question
 const sendQuery = async () => {
  if (!query) return;

  setLoading(true);

  const data = await api.chat(query);

  setMessages((prev) => [
    ...prev,
    { role: "user", text: query },
    { role: "ai", text: data.response },
  ]);

  setLoading(false);
  setQuery("");
};

  return (
    <div className="chat-container">
      {/* 🔷 Header */}
      <div className="chat-card">
        💬 AI Assistant ChatBOT
         <button
          className="chat-logout-button"
          title="Logout"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login"; // redirect
          }}
        >
        <FaSignOutAlt size={18} />
        </button>
      </div>

      {/* 📄 Upload Section */}
      <div className="chat-layout">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={uploadFile}
          className="chat-upload-button"
        >
          Upload
        </button>
      </div>

      {/* 💬 Chat Area */}
      <div className="chat-area">
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                maxWidth: "60%",
                padding: "12px 14px",
                borderRadius: "16px",
                background:
                  msg.role === "user" ? "#2563eb" : "#ffffff",
                color: msg.role === "user" ? "white" : "black",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                lineHeight: "1.5",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <p style={{ fontStyle: "italic" }}>AI is thinking...</p>
        )}

        <div ref={chatEndRef} />
        
      </div>

      {/* ⌨️ Input Section */}
      <div className="chat-input-div">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendQuery();
            }
          }}
          className="chat-input"
        />

        <button
          onClick={sendQuery}
          className="chat-input-button"
        >
          {loading ? "..." : <IoSend />}
        </button>
      </div>
    </div>
  );
}

export default App;