import { useState, useCallback } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { SOCKET_EVENTS } from '../utils/config';

export function CreateGroup({ isOpen, onClose, onCreated }) {
  const { socket } = useSocket();
  const auth = useAuth();
  const [groupName, setGroupName] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearchMember = () => {
    if (!memberSearch.trim() || !socket) return;

    setSearching(true);
    setSearchResult(null);

    socket.emit(SOCKET_EVENTS.FIND_FRIEND, { uniqueId: memberSearch.trim() });

    const handleResult = (data) => {
      if (data.friend) {
        // Don't add self
        if (data.friend._id === auth.user?._id) {
          setSearchResult({ error: "That's you!" });
        } else if (selectedMembers.find((m) => m._id === data.friend._id)) {
          setSearchResult({ error: 'Already added' });
        } else {
          setSearchResult({ user: data.friend });
        }
      } else {
        setSearchResult({ error: 'User not found' });
      }
      setSearching(false);
    };

    socket.once(SOCKET_EVENTS.FRIEND_FOUND, handleResult);
  };

  const handleAddMember = (member) => {
    setSelectedMembers((prev) => [...prev, member]);
    setSearchResult(null);
    setMemberSearch('');
  };

  const handleRemoveMember = (id) => {
    setSelectedMembers((prev) => prev.filter((m) => m._id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupName.trim()) return;

    setLoading(true);

    if (socket) {
      // Backend expects user: name (string), not object
      socket.emit(SOCKET_EVENTS.CREATE_ROOM, {
        user: auth.user?.name,
        name: groupName.trim(),
      });

      const handleRoomCreated = (data) => {
        if (onCreated) onCreated(data);
        resetForm();
        onClose();
      };

      socket.once(SOCKET_EVENTS.ROOM_CREATED, handleRoomCreated);
    }

    setLoading(false);
  };

  const resetForm = () => {
    setGroupName('');
    setSelectedMembers([]);
    setMemberSearch('');
    setSearchResult(null);
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || '?'
    );
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div
        className="modal-backdrop"
        onClick={() => {
          resetForm();
          onClose();
        }}
      />
      <div className="modal-content">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Create Group
          </h2>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Group Name */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '8px',
              }}
            >
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="input-field"
              disabled={loading}
            />
          </div>

          {/* Member Search */}
          {/* <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: 'var(--text-secondary)',
                marginBottom: '8px',
              }}
            >
              Add Members
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchMember();
                  }
                }}
                placeholder="Search by username"
                className="input-field"
                disabled={loading}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleSearchMember}
                disabled={!memberSearch.trim() || searching}
                className="btn btn-secondary"
              >
                {searching ? <span className="spinner" style={{ width: '14px', height: '14px' }} /> : 'Find'}
              </button>
            </div> */}

          {/* Search Result */}
          {/* {searchResult?.user && (
              <div
                className="animate-fade-in-up"
                style={{
                  marginTop: '8px',
                  padding: '10px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div className="avatar avatar-sm avatar-white">
                  {getInitials(searchResult.user.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.825rem' }}>
                    {searchResult.user.name}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    @{searchResult.user.uniqueId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddMember(searchResult.user)}
                  className="btn btn-sm btn-primary"
                >
                  Add
                </button>
              </div>
            )}

            {searchResult?.error && (
              <p style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-disabled)' }}>
                {searchResult.error}
              </p>
            )}
          </div> */}

          {/* Selected Members */}
          {/* {selectedMembers.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}
              >
                Members ({selectedMembers.length})
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedMembers.map((member) => (
                  <div key={member._id} className="chip">
                    <span>{member.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member._id)}
                      className="chip-close"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={loading || !groupName.trim()}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup;
