"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/lib/axiosInstance";

interface Chat {
  sender: string;
  content: string;
  timestamp: string;
}

const ChatPage = ({ params }: { params: { conversationId: string } }) => {
  const { conversationId } = params; // Get conversationId from the dynamic route
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!conversationId) {
      console.error("No conversationId provided in the route.");
      return;
    }

    // Fetch chat history on load
    const fetchChatHistory = async () => {
      try {
        const response = await axiosInstance.get(`/chats/${conversationId}`);
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [conversationId]);

  return (
    <div>
      <button onClick={() => router.push("/chats")}>Back to Chats</button>

      <h1>Chat History</h1>
      {chats.length === 0 ? (
        <p>No chat history found for this conversation.</p>
      ) : (
        <ul>
          {chats.map((chat, index) => (
            <li key={index}>
              <strong>{chat.sender}</strong>: {chat.content}{" "}
              <em>({new Date(chat.timestamp).toLocaleString()})</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatPage;
