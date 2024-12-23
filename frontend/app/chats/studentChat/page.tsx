"use client";

import React, { useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

interface Chat {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

const StudentChat = () => {
  const [chats, setChats] = useState<Chat[]>([]); // Stores chat messages
  const [recipientId, setRecipientId] = useState(""); // Recipient ID input
  const [message, setMessage] = useState(""); // Message content

  const createChat = async () => {
    if (!recipientId || !message) {
      alert("Please provide both Recipient ID and Message.");
      return;
    }
  
    try {
      const response = await axiosInstance.post("/chats", {
        recipientId,
        message,
      });
  
      console.log("Chat created:", response.data);
      setRecipientId(""); // Clear input
      setMessage(""); // Clear input
    } catch (error: any) {
      console.error("Error creating chat:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create chat.");
    }
  };

  return (
    <div>
      <h1>Student Chat</h1>

      {/* Input for Recipient ID and Message */}
      <div>
        <input
          type="text"
          placeholder="Enter Recipient ID"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mb-2 w-full"
        />
        <textarea
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mb-2 w-full"
        ></textarea>
        <button
          onClick={createChat}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Send Message
        </button>
      </div>

      {/* Chat Messages Display */}
      <h2 className="mt-4">Chat Messages</h2>
      <ul className="space-y-2">
        {chats.map((chat, index) => (
          <li key={index} className="p-2 border border-gray-300 rounded-md">
            <strong>{chat.sender}</strong>: {chat.content}{" "}
            <em>({new Date(chat.timestamp).toLocaleString()})</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentChat;


