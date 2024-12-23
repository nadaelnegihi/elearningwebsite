'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });

  // Fetch all notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get('/notes'); // Fetch notes
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleCreateNote = async () => {
    try {
      await axiosInstance.post('/notes', noteForm); // Create note
      setNoteForm({ title: '', content: '' });
      fetchNotes(); // Refresh notes
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async () => {
    if (!selectedNote) return;

    try {
      await axiosInstance.put(`/notes/${selectedNote.id}`, noteForm); // Update note
      setIsEditing(false);
      setSelectedNote(null);
      setNoteForm({ title: '', content: '' });
      fetchNotes(); // Refresh notes
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await axiosInstance.delete(`/notes/${id}`); // Delete note
      fetchNotes(); // Refresh notes
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEditNote = (note: Note) => {
    setIsEditing(true);
    setSelectedNote(note);
    setNoteForm({ title: note.title, content: note.content });
  };

  return (
    <div className="notes-page">
      <h1>Quick Notes</h1>

      <div className="note-form">
        <h2>{isEditing ? 'Edit Note' : 'Create Note'}</h2>
        <input
          type="text"
          placeholder="Title"
          value={noteForm.title}
          onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={noteForm.content}
          onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
        />
        <button onClick={isEditing ? handleUpdateNote : handleCreateNote}>
          {isEditing ? 'Update Note' : 'Create Note'}
        </button>
        {isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              setSelectedNote(null);
              setNoteForm({ title: '', content: '' });
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <div className="notes-list">
        <h2>All Notes</h2>
        {notes.map((note) => (
          <div key={note.id} className="note-item">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleEditNote(note)}>Edit</button>
            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
