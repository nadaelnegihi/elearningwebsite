import React, { useState } from 'react';

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (recipientId: string, message: string) => void;
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({ isOpen, onClose, onCreateChat }) => {
  const [recipientId, setRecipientId] = useState<string>(''); // Explicitly set type as string
  const [message, setMessage] = useState<string>(''); // Explicitly set type as string

  const handleSubmit = () => {
    if (recipientId && message) {
      onCreateChat(recipientId, message);
      onClose();
      setRecipientId(''); // Clear the input after creating the chat
      setMessage(''); // Clear the message
    } else {
      alert('Please provide both recipient ID and message!');
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <h3>Create Chat</h3>
        <input
          type="text"
          placeholder="Recipient ID"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button onClick={handleSubmit}>Create</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    )
  );
};

export default CreateChatModal;

  