"use client";

import Chatbot from "./Chatbot";

export default function ChatbotWrapper() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 100,
      }}
    >
      <Chatbot />
    </div>
  );
}
