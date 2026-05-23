import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
// import { checkout } from '../../backend/routes/request';

export function MessagesList({ onSelectRoom, selectedRoomId, setchatroomactive, chatroomactive }) {
  const auth = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch rooms using _id
  useEffect(() => {
    if (!auth.user?._id) return;

    setLoading(true);
    api
      .fetchRooms(auth.user._id)
      .then((data) => {
        
        const roomsData = data.data || data.content || [];
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      })
      .catch((err) => {
        console.error('Failed to fetch rooms:', err);
          auth.logout();
        
        setRooms([]);
      })
      .finally(() => setLoading(false));
  }, [auth.user?._id]);

  // Filter rooms based on search
  const filteredRooms = rooms.filter((room) => {
    const searchLower = searchTerm.toLowerCase();
    const names = Array.isArray(room.name) ? room.name : [room.name];
    return (
      names.some((n) => n?.toLowerCase().includes(searchLower)) ||
      room.members?.some((m) => m?.toLowerCase().includes(searchLower))
    );
  });

  const getInitials = (name) => {
    if (Array.isArray(name)) {
      return name[0]?.[0]?.toUpperCase() || '?';
    }
    return (
      name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || '?'
    );
  };

  const getRoomDisplayName = (room) => {
    if (room.Type === 'friend' && Array.isArray(room.name)) {
      // Show the other person's name, not ours
      const otherName = room.name.find((n) => n !== auth.user?.name);
      return otherName || room.name[0] || 'Chat';
    }
    if (Array.isArray(room.name)) {
      return room.name.join(', ');
    }
    return room.name || 'Unnamed';
  };

  const getRoomIcon = (room) => {
    if (room.Type === 'friend') {
      return getRoomDisplayName(room)?.[0]?.toUpperCase() || '?';
    }
    return getInitials(room.name);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header + Search */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-primary)' }}>
        <h2
          style={{
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '10px',
          }}
        >
          Messages
        </h2>
        <div style={{ position: 'relative' }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: 'absolute',
              left: '10px',
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
            placeholder="Search conversations..."
            className="input-field"
            style={{ paddingLeft: '32px', fontSize: '0.8rem', padding: '8px 12px 8px 32px' }}
          />
        </div>
      </div>

      {/* Rooms List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                }}
              >
                <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '60%', height: '12px', marginBottom: '6px' }} />
                  <div className="skeleton" style={{ width: '40%', height: '10px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              padding: '32px',
            }}
          >
            <div>
              <p style={{ color: 'var(--text-disabled)', fontSize: '0.85rem', marginBottom: '4px' }}>
                {searchTerm ? 'No matching conversations' : 'No conversations yet'}
              </p>
              <p style={{ color: 'var(--text-disabled)', fontSize: '0.75rem' }}>
                {searchTerm ? 'Try a different search' : 'Find friends to start chatting'}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '4px' }}>
            {filteredRooms.map((room, index) => {
              const isSelected = (room._id || room.id) === selectedRoomId;
              const displayName = getRoomDisplayName(room);

              return (
                <div
                  key={room._id || room.id}
                  onClick={() => {
                    // setchatroomactive(prev => !prev); chatroomactive && 
                    onSelectRoom(room)

                    // if (selectedRoomId?._id === room._id && chatroomactive) {
                    //   setchatroomactive(false);
                    // } else {
                    //   onSelectRoom(room);
                    //   setchatroomactive(true);
                    // }
                  }}
                  className="animate-fade-in"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    margin: '2px 4px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    background: isSelected ? 'var(--bg-elevated)' : 'transparent',
                    border: isSelected
                      ? '1px solid var(--border-secondary)'
                      : '1px solid transparent',
                    animationDelay: `${index * 30}ms`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {/* Avatar */}
                  <div
                    className={`avatar avatar-md ${room.Type === 'friend' ? 'avatar-white' : 'avatar-gray'}`}
                  >
                    {getRoomIcon(room)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '2px',
                      }}
                    >
                      {displayName}
                    </h3>
                    <p
                      style={{
                        color: 'var(--text-disabled)',
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {room.Type === 'friend' ? 'Direct message' : `${room.members?.length || 0} members`}
                    </p>
                  </div>

                  {/* Indicator for selected */}
                  {isSelected && (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesList;
