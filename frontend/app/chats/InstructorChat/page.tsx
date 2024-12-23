"use client";

import React, { useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import Sidebar from "@/app/components/sidebar";
import CreateGroupChatModal from "@/app/components/CreateGroupChatModal";

interface Chat {
  sender: string;
  content: string;
  timestamp: string;
}

const InstructorChat = () => {
  const [chats, setChats] = useState<Chat[]>([]); // Stores chat messages
  const [recipientId, setRecipientId] = useState<string>(""); // Recipient ID input
  const [message, setMessage] = useState<string>(""); // Message input
  const [showGroupModal, setShowGroupModal] = useState<boolean>(false); // Toggle for group chat modal

  // Function to create and send a message
  const createChat = async () => {
    try {
      const response = await axiosInstance.post("/chats", {
        recipientId,
        message,
      });
      // Add the newly created chat to the chat list
      setChats((prevChats) => [...prevChats, response.data]);
      setRecipientId(""); // Reset input
      setMessage(""); // Reset input
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <div className="chat-page">
      <Sidebar />
      <main>
        <h1 className="text-xl font-bold mb-4">Instructor Chat</h1>

        {/* Input for Recipient ID and Message */}
        <div className="mb-4">
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
        <h2 className="text-lg font-bold mb-2">Chat Messages</h2>
        <ul className="space-y-2">
          {chats.map((chat, index) => (
            <li key={index} className="p-2 border border-gray-300 rounded-md">
              <strong>{chat.sender}</strong>: {chat.content}{" "}
              <em>({new Date(chat.timestamp).toLocaleString()})</em>
            </li>
          ))}
        </ul>

        {/* Create Group Chat Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowGroupModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
          >
            Create Group Chat
          </button>
        </div>

        {/* Create Group Chat Modal */}
        {showGroupModal && (
          <CreateGroupChatModal
            isOpen={showGroupModal}
            onClose={() => setShowGroupModal(false)}
            onGroupChatCreated={(groupChat) => {
              console.log("Group chat created:", groupChat);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default InstructorChat;


