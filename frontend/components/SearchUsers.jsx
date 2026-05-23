import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { SOCKET_EVENTS } from '../utils/config';

export function SearchUsers({ onSelectUser, onSendRequest }) {
  const { socket } = useSocket();
  const auth = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState({});
  const debounceTimer = useRef(null);

  // Debounced search
  const performSearch = useCallback(
    (term) => {
      if (!term.trim() || !socket) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      socket.emit(SOCKET_EVENTS.FIND_FRIEND, { uniqueId: term.trim() });

      const handleResult = (data) => {
        if (data.friend) {
          // Don't show self
          if (data.friend.uniqueId === auth.user?.uniqueId) {
            setResults([]);
          } else {
            setResults([data.friend]);
          }
        } else {
          setResults([]);
        }
        setLoading(false);
      };

      socket.once(SOCKET_EVENTS.FRIEND_FOUND, handleResult);
    },
    [socket, auth.user?.uniqueId]
  );

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimer.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 400);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, performSearch]);

  const handleSendRequest = (user) => {
    if (!socket || !auth.user) return;

    socket.emit(SOCKET_EVENTS.SEND_REQUEST, {
      id: auth.user._id,
      user: auth.user.name,
      friend: user,
    });

    setRequestSent((prev) => ({ ...prev, [user._id]: true }));

    if (onSendRequest) {
      onSendRequest(user);
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
    <div style={{ width: '100%' }}>
      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-disabled)',
            pointerEvents: 'none',
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by username..."
          className="input-field"
          style={{ paddingLeft: '38px' }}
        />
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {results.map((user) => (
            <div
              key={user._id || user.id}
              className="animate-fade-in-up"
              style={{
                padding: '12px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {/* Avatar */}
              <div className="avatar avatar-md avatar-white">{getInitials(user.name)}</div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.name}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>@{user.uniqueId}</p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {requestSent[user._id] ? (
                  <span
                    style={{
                      padding: '5px 10px',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      fontWeight: '500',
                    }}
                  >
                    Sent ✓
                  </span>
                ) : (
                  <button
                    onClick={() => handleSendRequest(user)}
                    className="btn btn-sm btn-primary"
                    disabled={!auth.user?._id}
                  >
                    Add
                  </button>
                )}
                <button
                  onClick={() => onSelectUser && onSelectUser(user)}
                  className="btn btn-sm btn-secondary"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', padding: '8px' }}>
          <div className="spinner" />
        </div>
      )}

      {/* No results */}
      {searchTerm && !loading && results.length === 0 && (
        <div
          style={{
            marginTop: '12px',
            textAlign: 'center',
            padding: '16px',
            color: 'var(--text-disabled)',
            fontSize: '0.8rem',
          }}
        >
          No users found for &quot;{searchTerm}&quot;
        </div>
      )}
    </div>
  );
}

export default SearchUsers;
