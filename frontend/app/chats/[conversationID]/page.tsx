"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/lib/axiosInstance";
import { AxiosError } from "axios";
import Sidebar from "@/app/components/sidebar";

interface Chat {
  sender: string;
  content: string;
  timestamp: string;
}

const ChatPage = ({ params }: { params: { conversationID?: string } }) => {
  const conversationId = params?.conversationID;
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!conversationId) {
      console.error("No conversationId provided in the route.");
      return;
    }

    console.log("Params received:", params);
    console.log("Conversation ID:", conversationId);

    const fetchChatHistory = async () => {
      try {
        const response = await axiosInstance.get(`/chats/${conversationId}`);
        setChats(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.error("Error fetching chat history:", error.response?.data || error.message);
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    };

    fetchChatHistory();
  }, [conversationId]);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <main className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => router.push("/chats")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 mb-6"
        >
          Back to Chats
        </button>

        <h1 className="text-4xl font-extrabold mb-6 text-center">Chat History</h1>
        {chats.length === 0 ? (
          <p className="text-gray-400 text-center">No chat history found for this conversation.</p>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <ul className="space-y-4">
              {chats.map((chat, index) => (
                <li
                  key={index}
                  className="bg-gray-700 p-4 rounded-md shadow-md border border-gray-600"
                >
                  <p>
                    <strong>{chat.sender || "Unknown Sender"}</strong>: {chat.content || "No Content"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {chat.timestamp
                      ? new Date(chat.timestamp).toLocaleString()
                      : "No Timestamp"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
