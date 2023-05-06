import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function ChatSection() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom of chat window after new messages are added
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    console.log("hjjjjjjjjjj");
    // Listen for incoming messages
    socket.on("message", (message) => {
      console.log("message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for message history on connection
    socket.on("message history", (messageHistory) => {
      setMessages(messageHistory);
    });
  }, []);

  function handleMessageSubmit(event) {
    event.preventDefault();
    if (inputValue.trim()) {
      console.log("inputValue", inputValue);
      socket.emit("message", inputValue);
      setInputValue("");
    }
  }

  return (
    <div>
      <h1>Real-Time Chat App</h1>
      <div className="message-list">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.id === socket.id ? "message self" : "message"}
          >
            <div className="message-body">{message.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatSection;
