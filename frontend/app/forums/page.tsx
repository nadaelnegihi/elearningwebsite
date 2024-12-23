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
  const [posts, setPosts] = useState<ForumPost[]>([]); // List of forum posts
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null); // Currently selected post
  const [newPost, setNewPost] = useState({ title: "", content: "" }); // New post form
  const [newComment, setNewComment] = useState(""); // New comment form

  // Fetch all forum posts
  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/forums");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
    }
  };

  // Fetch comments for a specific post
  const fetchComments = async (postId: string) => {
    try {
      const response = await axiosInstance.get(`/forums/${postId}/comments`);
      setSelectedPost((prevPost) =>
        prevPost ? { ...prevPost, comments: response.data } : null
      );
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const createPost = async () => {
    if (!newPost.title || !newPost.content) {
      alert("Please fill in both title and content.");
      return;
    }
  
    try {
      console.log("Creating post with data:", newPost);
  
      const response = await axiosInstance.post("/forums", {
        ...newPost,
        creator: "currentUserId", // Replace this with the actual creator ID
      });
  
      setPosts((prevPosts) => [...prevPosts, response.data]); // Add new post to the list
      setNewPost({ title: "", content: "" }); // Reset the form
    } catch (error: any) {
      console.error("Error creating post:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create post.");
    }
  

    try {
      const response = await axiosInstance.post("/forums", newPost);
      setPosts((prevPosts) => [...prevPosts, response.data]); // Add new post to the list
      setNewPost({ title: "", content: "" }); // Reset the form
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Create a new comment for a post
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
      ); // Add new comment to the selected post
      setNewComment(""); // Reset the comment form
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch posts when the component loads
  }, []);

  return (
    <div className="forum-page">
      <Sidebar />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Forums</h1>

        {/* Create New Post */}
        <div className="mb-6">
          <h2 className="text-lg font-bold">Create a New Post</h2>
          <input
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="p-2 border border-gray-300 rounded-md mb-2 w-full"
          />
          <textarea
            placeholder="Post Content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="p-2 border border-gray-300 rounded-md mb-2 w-full"
          ></textarea>
          <button
            onClick={createPost}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Create Post
          </button>
        </div>

        {/* Forum Posts */}
        <div>
          <h2 className="text-lg font-bold">All Posts</h2>
          <ul className="space-y-4">
            {posts.map((post, index) => (
              <li
                key={post.id || index} // Ensures unique key for each post
                className="p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSelectedPost(post);
                  fetchComments(post.id); // Fetch comments when post is selected
                }}
              >
                <h3 className="font-bold">{post.title}</h3>
                <p>{post.content}</p>
                <p className="text-sm text-gray-500">
                  By {post.creator} on {new Date(post.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Post and Comments */}
        {selectedPost && (
          <div className="mt-6">
            <h2 className="text-lg font-bold">Post Details</h2>
            <h3 className="font-bold">{selectedPost.title}</h3>
            <p>{selectedPost.content}</p>

            <h3 className="text-lg font-bold mt-4">Comments</h3>
            <ul className="space-y-2">
              {selectedPost.comments.map((comment, index) => (
                <li
                  key={comment.id || index} // Ensures unique key for each comment
                  className="p-2 border border-gray-300 rounded-md"
                >
                  {comment.content}{" "}
                  <span className="text-sm text-gray-500">
                    - {comment.creator} on{" "}
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            {/* Add Comment */}
            <div className="mt-4">
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="p-2 border border-gray-300 rounded-md mb-2 w-full"
              ></textarea>
              <button
                onClick={() => createComment(selectedPost.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
              >
                Add Comment
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ForumPage;
