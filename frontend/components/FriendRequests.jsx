import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { SOCKET_EVENTS } from '../utils/config';
import { api } from '../utils/api';

export function FriendRequests({ onRequestsChange }) {
  const auth = useAuth();
  const { socket } = useSocket();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);

  // Fetch friend requests using user's _id
  useEffect(() => {
    if (!auth.user?._id) return;

    setLoading(true);
    api
      .fetchRequests(auth.user._id)
      .then((data) => {
        const requestsData = data.content || data.data || [];
        const arr = Array.isArray(requestsData) ? requestsData : [];
        setRequests(arr);
        if (onRequestsChange) onRequestsChange(arr);
      })
      .catch((err) => {
        console.error('Failed to fetch requests:', err);
        setRequests([]);
        if (onRequestsChange) onRequestsChange([]);
      })
      .finally(() => setLoading(false));
  }, [auth.user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for new incoming requests
  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = (data) => {
      if (data && data.senderId) {
        setRequests((prev) => {
          const updated = [...prev, data];
          if (onRequestsChange) onRequestsChange(updated);
          return updated;
        });
      }
    };

    socket.on(SOCKET_EVENTS.SEND_REQUEST_RESPONSE, handleNewRequest);

    return () => {
      socket.off(SOCKET_EVENTS.SEND_REQUEST_RESPONSE, handleNewRequest);
    };
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAccept = (request) => {
    if (!socket || !auth.user?._id) return;

    setAcceptingId(request._id || request.id);

    // Create DM room — send correct data for 'createroomwiththefriend'
    socket.emit(SOCKET_EVENTS.CREATE_ROOM_WITH_FRIEND, {
      senderId: request.senderId,
      receiverId: auth.user._id,
      senderName: request.senderName,
      user: auth.user.name,
    });

    // Remove from list
    setRequests((prev) => {
      const updated = prev.filter((r) => (r._id || r.id) !== (request._id || request.id));
      if (onRequestsChange) onRequestsChange(updated);
      return updated;
    });

    setTimeout(() => setAcceptingId(null), 500);
  };

  const handleReject = (request) => {
    setRequests((prev) => {
      const updated = prev.filter((r) => (r._id || r.id) !== (request._id || request.id));
      if (onRequestsChange) onRequestsChange(updated);
      return updated;
    });
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div
        style={{
          padding: '24px 16px',
          textAlign: 'center',
          color: 'var(--text-disabled)',
          fontSize: '0.8rem',
        }}
      >
        <p>No pending requests</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
      {requests.map((request, index) => (
        <div
          key={request._id || request.id || index}
          className="animate-fade-in-up"
          style={{
            padding: '10px 12px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animationDelay: `${index * 50}ms`,
          }}
        >
          {/* Avatar */}
          <div className="avatar avatar-sm avatar-white">
            {getInitials(request.senderName || request.name)}
          </div>

          {/* Name */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                color: 'var(--text-primary)',
                fontWeight: '600',
                fontSize: '0.825rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {request.senderName || request.name}
            </p>
            <p style={{ color: 'var(--text-disabled)', fontSize: '0.7rem' }}>
              wants to connect
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button
              onClick={() => handleAccept(request)}
              disabled={acceptingId === (request._id || request.id)}
              className="btn btn-sm btn-primary"
            >
              {acceptingId === (request._id || request.id) ? '...' : 'Accept'}
            </button>
            <button
              onClick={() => handleReject(request)}
              className="btn btn-sm btn-ghost"
              style={{ color: 'var(--text-muted)' }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FriendRequests;
