"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/app/lib/axiosInstance";
import Sidebar from "@/app/components/sidebar";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  comments: Comment[];
  creator: string;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  timestamp: string;
  creator: string;
}

const ForumPage = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get("/forums");
        setPosts(response.data);
      } catch (err: any) {
        console.error("Error fetching forum posts:", err);
        setError(err.response?.data?.message || "Failed to fetch forum posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!newPost.title || !newPost.content) {
      alert("Please fill in both title and content.");
      return;
    }
    try {
      const response = await axiosInstance.post("/forums", {
        ...newPost,
        creator: "currentUserId", // Replace with actual creator ID
      });
      setPosts((prevPosts) => [...prevPosts, response.data]);
      setNewPost({ title: "", content: "" });
    } catch (error: any) {
      console.error("Error creating post:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create post.");
    }
  };

  const createComment = async (postId: string) => {
    if (!newComment) {
      alert("Please enter a comment.");
      return;
    }
    try {
      const response = await axiosInstance.post(`/forums/${postId}/comments`, {
        content: newComment,
      });
      setSelectedPost((prevPost) =>
        prevPost
          ? { ...prevPost, comments: [...prevPost.comments, response.data] }
          : null
      );
      setNewComment("");
    } catch (error: any) {
      console.error("Error creating comment:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create comment.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading forums...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Forums</h1>

        {/* Create New Post Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-2xl font-semibold mb-4">Create a New Post</h2>
          <input
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white mb-4"
          />
          <textarea
            placeholder="Post Content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white mb-4"
            rows={5}
          ></textarea>
          <button
            onClick={createPost}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            Create Post
          </button>
        </div>

        {/* Forum Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-gray-400 mb-4">
                {post.content.length > 100
                  ? post.content.slice(0, 100) + "..."
                  : post.content}
              </p>
              <p className="text-sm text-gray-500">
                By {post.creator} on {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Post Details */}
        {selectedPost && (
          <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">{selectedPost.title}</h2>
            <p className="text-gray-400 my-4">{selectedPost.content}</p>

            <h3 className="text-xl font-bold mt-6 mb-4">Comments</h3>
            <ul className="space-y-4">
              {selectedPost.comments.map((comment) => (
                <li
                  key={comment.id}
                  className="bg-gray-700 p-4 rounded-md border border-gray-600"
                >
                  {comment.content}{" "}
                  <span className="text-sm text-gray-500">
                    - {comment.creator} on{" "}
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            {/* Add Comment Section */}
            <div className="mt-6">
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white mb-4"
                rows={3}
              ></textarea>
              <button
                onClick={() => createComment(selectedPost.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
              >
                Add Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;

