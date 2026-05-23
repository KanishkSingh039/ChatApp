import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { SOCKET_EVENTS } from '../utils/config';

export function UserProfile({ user, onClose, onMessage }) {
  const { socket } = useSocket();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  if (!user) return null;

  const handleAddFriend = () => {
    if (!socket || !auth.user?._id) return;

    setLoading(true);

    // Correct payload for 'sendrequest'
    socket.emit(SOCKET_EVENTS.SEND_REQUEST, {
      id: auth.user._id,
      user: auth.user.name,
      friend: user,
    });

    setRequestSent(true);
    setLoading(false);
  };

  const handleMessage = () => {
    if (onMessage) {
      onMessage(user);
    }
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
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content" style={{ textAlign: 'center' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '1.1rem',
            padding: '4px',
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Avatar */}
        <div style={{ marginTop: '16px', marginBottom: '20px' }}>
          <div
            className="avatar avatar-xl avatar-white"
            style={{ margin: '0 auto' }}
          >
            {getInitials(user.name)}
          </div>
        </div>

        {/* Info */}
        <h2
          style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}
        >
          {user.name}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>
          @{user.uniqueId}
        </p>
        {user.email && (
          <p style={{ color: 'var(--text-disabled)', fontSize: '0.75rem', marginBottom: '24px' }}>
            {user.email}
          </p>
        )}
        {!user.email && <div style={{ height: '24px' }} />}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={handleMessage} className="btn btn-primary btn-full">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Message
          </button>

          {requestSent ? (
            <div
              style={{
                padding: '10px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: '500',
              }}
            >
              Friend request sent ✓
            </div>
          ) : (
            <button
              onClick={handleAddFriend}
              disabled={loading || !auth.user?._id}
              className="btn btn-secondary btn-full"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              {loading ? 'Sending...' : 'Send Friend Request'}
            </button>
          )}

          <button
            onClick={onClose}
            className="btn btn-ghost btn-full"
            style={{ marginTop: '4px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
