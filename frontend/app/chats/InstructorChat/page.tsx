"use client";

import React, { useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import Sidebar from "@/app/components/sidebar";
import CreateGroupChatModal from "@/app/components/CreateGroupChatModal";

interface Chat {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

const InstructorChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showGroupModal, setShowGroupModal] = useState<boolean>(false);

  const createChat = async () => {
    if (!recipientId || !message) {
      alert("Please provide both Recipient ID and Message.");
      return;
    }

    try {
      const response = await axiosInstance.post("/chats", {
        conversationId: conversationId || undefined,
        recipientId,
        message,
      });

      if (!conversationId) {
        setConversationId(response.data.conversationId);
      }

      setChats((prevChats) => [...prevChats, response.data.chat]);
      setRecipientId("");
      setMessage("");
    } catch (error: any) {
      console.error("Error creating chat:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create chat.");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Instructor Chat</h1>

        {/* Create New Message */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
          <input
            type="text"
            placeholder="Enter Recipient ID"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            className="w-full p-3 mb-4 rounded-md bg-gray-700 border border-gray-600 text-white"
          />
          <textarea
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 mb-4 rounded-md bg-gray-700 border border-gray-600 text-white"
          ></textarea>
          <button
            onClick={createChat}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            Send Message
          </button>
        </div>

        {/* Chat Messages */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-2xl font-bold mb-4">Chat Messages</h2>
          <div className="space-y-4">
            {chats.length > 0 ? (
              chats.map((chat, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-4 rounded-md shadow-md border border-gray-600"
                >
                  <p>
                    <strong>{chat.sender || "Unknown Sender"}</strong>:{" "}
                    {chat.content || "No Content"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {chat.timestamp
                      ? new Date(chat.timestamp).toLocaleString()
                      : "No Timestamp"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No messages yet.</p>
            )}
          </div>
        </div>

        {/* Create Group Chat */}
        <div className="text-center">
          <button
            onClick={() => setShowGroupModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
          >
            Create Group Chat
          </button>
        </div>

        {/* Group Chat Modal */}
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
