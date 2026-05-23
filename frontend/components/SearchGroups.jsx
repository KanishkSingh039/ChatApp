import { useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { SOCKET_EVENTS } from '../utils/config';
import { showToast } from './Toast';

export function SearchGroups({ onJoinedRoom }) {
  const { socket } = useSocket();
  const auth = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null); // { group } or { error }
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const debounceTimer = useRef(null);

  // Debounced search
  const performSearch = useCallback(
    (term) => {
      if (!term.trim() || !socket) {
        setResult(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      socket.emit(SOCKET_EVENTS.SEARCH_GROUP, term.trim());

      const handleResult = (data) => {
        if (data.group) {
          setResult({ group: data.group });
        } else {
          setResult({ error: data.message || 'Group not found' });
        }
        setLoading(false);
      };

      socket.once(SOCKET_EVENTS.SEARCH_GROUP_RESPONSE, handleResult);
    },
    [socket]
  );

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!searchTerm.trim()) {
      setResult(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimer.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchTerm, performSearch]);

  // Join room handler
  const handleJoinRoom = (group) => {
    if (!socket || !auth.user?.name || !group?._id) return;

    setJoining(true);

    socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
      joinroomId: group._id,
      user: auth.user.name,
    });

    const handleJoinResponse = (data) => {
      setJoining(false);

      if (data.findroom) {
        showToast('Joined group successfully!', 'success');
        if (onJoinedRoom) onJoinedRoom(data.findroom);
        setSearchTerm('');
        setResult(null);
      } else {
        showToast(data.message || 'Could not join group', 'error');
      }
    };

    socket.once(SOCKET_EVENTS.JOIN_ROOM_RESPONSE, handleJoinResponse);
  };

  const getInitials = (name) => {
    if (Array.isArray(name)) return name[0]?.[0]?.toUpperCase() || 'G';
    return (
      name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'G'
    );
  };

  const getDisplayName = (name) => {
    if (Array.isArray(name)) return name.join(', ');
    return name || 'Unnamed Group';
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
          placeholder="Search by group name..."
          className="input-field"
          style={{ paddingLeft: '38px' }}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', padding: '8px' }}>
          <div className="spinner" />
        </div>
      )}

      {/* Group Result */}
      {result?.group && !loading && (
        <div
          className="animate-fade-in-up"
          style={{
            marginTop: '12px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Group Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="avatar avatar-lg avatar-gray">
                {getInitials(result.group.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    color: 'var(--text-primary)',
                    fontWeight: '700',
                    fontSize: '1rem',
                    marginBottom: '3px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getDisplayName(result.group.name)}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {result.group.Type === 'friend' ? 'Direct Message' : 'Group'}
                </p>
              </div>
            </div>
          </div>

          {/* Group Details */}
          <div style={{ padding: '12px 16px' }}>
            {/* Members count */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {result.group.members?.length || 0} member{(result.group.members?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Created info */}
            {result.group.createdAt && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  Created {new Date(result.group.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}

            {/* Join Button */}
            <button
              onClick={() => handleJoinRoom(result.group)}
              disabled={joining}
              className="btn btn-primary btn-full"
            >
              {joining ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
                  Joining...
                </span>
              ) : (
                <>
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
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Join Group
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Not found */}
      {result?.error && !loading && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: '12px',
            textAlign: 'center',
            padding: '20px 16px',
            color: 'var(--text-disabled)',
            fontSize: '0.8rem',
          }}
        >
          <p>{result.error}</p>
        </div>
      )}

      {/* Empty state */}
      {!searchTerm && !result && (
        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>
            Search for groups
          </p>
          <p style={{ color: 'var(--text-disabled)', fontSize: '0.75rem' }}>
            Enter a group name to find and join
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchGroups;
