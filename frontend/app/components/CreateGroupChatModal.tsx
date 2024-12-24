import { useState } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface CreateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupChatCreated: (groupChat: any) => void; // Callback to update the parent state
}

const CreateGroupChatModal: React.FC<CreateGroupChatModalProps> = ({
  isOpen,
  onClose,
  onGroupChatCreated,
}) => {
  const [groupName, setGroupName] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const addParticipant = () => {
    if (newParticipant && !participants.includes(newParticipant)) {
      setParticipants([...participants, newParticipant]);
      setNewParticipant('');
    }
  };

  const removeParticipant = (participant: string) => {
    setParticipants(participants.filter((p) => p !== participant));
  };

  const createGroupChat = async () => {
    try {
      if (!groupName) {
        setError('Group name is required');
        return;
      }

      if (participants.length < 2) {
        setError('At least two participants are required');
        return;
      }

      const response = await axiosInstance.post('/chats/create-group', {
        groupName,
        participants,
      });

      onGroupChatCreated(response.data);
      onClose();
    } catch (err) {
      setError('Failed to create group chat');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create Group Chat</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <label htmlFor="groupName">Group Name:</label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="newParticipant">Add Participant:</label>
          <input
            type="text"
            id="newParticipant"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
          />
          <button onClick={addParticipant}>Add</button>
        </div>
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>
              {participant}
              <button onClick={() => removeParticipant(participant)}>Remove</button>
            </li>
          ))}
        </ul>
        <button onClick={createGroupChat}>Create Group Chat</button>
        <button onClick={onClose}>Cancel</button>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
        }
        .error {
          color: red;
          margin-top: 10px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
      `}</style>
    </div>
  );
};

export default CreateGroupChatModal;
