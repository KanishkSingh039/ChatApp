import { useEffect, useState} from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import ChatRoom from './ChatRoom';
import MessagesList from './MessagesList';
import FriendRequests from './FriendRequests';
import SearchUsers from './SearchUsers';
import SearchGroups from './SearchGroups';
import UserProfile from './UserProfile';
import CreateGroup from './CreateGroup';
import { SOCKET_EVENTS,STORAGE_KEYS } from '../utils/config';
import { showToast } from './Toast';
export function MainLayout() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { socket } = useSocket();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSearchUsers, setShowSearchUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showOwnProfile, setShowOwnProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requestCount, setRequestCount] = useState(0);
  const [chatroomactive, setchatroomactive] = useState(false);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'search' | 'requests'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // On mobile, start with sidebar open (so user sees chats first)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(true);
    }
  }, []);

  // Handle room creation from socket
  useEffect(() => {
    if (!socket) return;
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    const handleRoomCreated = (data) => {
      if (data.roomId || data._id) {
        setSelectedRoom(data);
        showToast('Room created!', 'success');
      }
    };

    const handleDMCreated = (data) => {
      if (data.room) {
        setSelectedRoom(data.room);
        showToast('Chat started!', 'success');
      } else if (data.createroom) {
        setSelectedRoom(data.createroom);
      }
    };

    socket.on(SOCKET_EVENTS.ROOM_CREATED, handleRoomCreated);
    socket.on(SOCKET_EVENTS.ROOM_CREATED_WITH_FRIEND, handleDMCreated);

    return () => {
      socket.off(SOCKET_EVENTS.ROOM_CREATED, handleRoomCreated);
      socket.off(SOCKET_EVENTS.ROOM_CREATED_WITH_FRIEND, handleDMCreated);
    };
  }, [socket]);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    // On mobile, always close sidebar when a room is selected
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleMessageUser = (user) => {
    if (socket && auth.user?._id) {
      socket.emit(SOCKET_EVENTS.CREATE_ROOM_WITH_FRIEND, {
        senderId: auth.user._id,
        receiverId: user._id || user.id,
        senderName: auth.user.name,
        user: auth.user.name,
      });
    }
    setSelectedUser(null);
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', overflow: 'hidden', background: 'var(--bg-primary)', position: 'relative' }}>
      {/* ===== MOBILE SIDEBAR BACKDROP ===== */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 35,
            animation: 'fadeIn var(--transition-fast) ease-out',
          }}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <div
        className={isMobile ? `sidebar-mobile ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}` : ''}
        style={{
          ...(!isMobile ? {
            width: sidebarOpen ? '340px' : '0',
            minWidth: sidebarOpen ? '340px' : '0',
            overflow: 'hidden',
            transition: 'all var(--transition-normal)',
          } : {}),
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: '16px 18px',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h1
              style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Speakify
            </h1>
            <div style={{ display: 'flex', gap: '4px' }}>
              {/* Create Group Button */}
              <button
                onClick={() => setShowCreateGroup(true)}
                title="Create Group"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              {/* Mobile close */}
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="sidebar-close-btn-mobile"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* User Card — clickable to view own profile */}
          <div
            className="user-card-clickable"
            onClick={() => setShowOwnProfile(true)}
            title="View your profile"
            style={{
              padding: '10px 12px',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div className="avatar avatar-sm avatar-white">
              {auth.user?.name?.[0]?.toUpperCase() || '?'}
            </div>
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
                {auth.user?.name}
              </p>
              {auth.user?.uniqueId && (
                <p style={{ color: 'var(--text-disabled)', fontSize: '0.7rem' }}>
                  @{auth.user.uniqueId}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <div
                className="status-dot status-online"
                title="Connected"
              />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className={isMobile ? 'mobile-tabs' : ''}
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-primary)',
            padding: '0 4px',
          }}
        >
          {[
            { id: 'chats', label: 'Chats', icon: '💬' },
            { id: 'search', label: 'Friends', icon: '👤' },
            { id: 'groups', label: 'Groups', icon: '👥' },
            { id: 'requests', label: 'Requests', badge: requestCount, icon: '📩' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: isMobile ? '12px 6px' : '10px 8px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: isMobile ? '0.7rem' : '0.78rem',
                fontWeight: '600',
                fontFamily: "'Inter', sans-serif",
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                minWidth: 0,
              }}
            >
              {tab.label}
              {tab.badge > 0 && <span className="badge">{tab.badge}</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'chats' && (
            <MessagesList onSelectRoom={handleSelectRoom} selectedRoomId={selectedRoom?._id} setchatroomactive={setchatroomactive} chatroomactive={chatroomactive} />
          )}

          {activeTab === 'search' && (
            <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto' }}>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                }}
              >
                Find people by their username
              </p>
              <SearchUsers
                onSelectUser={(user) => {
                  handleSelectUser(user);
                }}
              />
            </div>
          )}

          {activeTab === 'groups' && (
            <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto' }}>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                }}
              >
                Find and join groups by name
              </p>
              <SearchGroups
                onJoinedRoom={(room) => {
                  setSelectedRoom(room);
                  setActiveTab('chats');
                }}
              />
            </div>
          )}

          {activeTab === 'requests' && (
            <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto' }}>
              <FriendRequests
                onRequestsChange={(reqs) => {
                  const arr = Array.isArray(reqs) ? reqs : [];
                  setRequestCount(arr.length);
                }}
              />
            </div>
          )}
        </div>

        {/* Logout */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-primary)' }}>
          <button
            onClick={handleLogout}
            className="btn btn-danger btn-full btn-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      </div>

      {/* ===== MAIN CHAT AREA ===== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%', overflow: 'hidden' }}>
        {/* Chat or Empty State */}
        {selectedRoom ? (
          <ChatRoom
            roomId={selectedRoom._id || selectedRoom.roomId || selectedRoom.id}
            roomName={selectedRoom.name || selectedRoom.roomname}
            roomMembers={selectedRoom.members || []}
            roomtype={selectedRoom.type}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => {
              if (isMobile) {
                setSidebarOpen(true);
              } else {
                setSidebarOpen((prev) => !prev);
              }
            }}
          />
        ) : (
          <div
            className="animate-fade-in"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-primary)',
            }}
          >
            {/* Header with hamburger — always show on mobile, or when sidebar is closed on desktop */}
            {(isMobile || !sidebarOpen) && (
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border-primary)',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <button
                  onClick={() => setSidebarOpen(true)}
                  title="Open sidebar"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
                <h2 style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                  Speakify
                </h2>
              </div>
            )}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', maxWidth: '280px' }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600', marginBottom: '6px' }}>
                  Select a conversation
                </h3>
                <p style={{ color: 'var(--text-disabled)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  Choose a chat from the sidebar or search for someone new
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== MODALS (rendered via Portal to escape overflow:hidden) ===== */}

      {/* User Profile Modal (other users) */}
      {selectedUser && createPortal(
        <UserProfile
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onMessage={handleMessageUser}
        />,
        document.body
      )}

      {/* Own Profile Modal */}
      {showOwnProfile && auth.user && createPortal(
        <div className="modal-overlay animate-fade-in">
          <div className="modal-backdrop" onClick={() => setShowOwnProfile(false)} />
          <div className="modal-content" style={{ textAlign: 'center' }}>
            {/* Close Button */}
            <button
              onClick={() => setShowOwnProfile(false)}
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
                {auth.user.name?.[0]?.toUpperCase() || '?'}
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
              {auth.user.name}
            </h2>
            {auth.user.uniqueId && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>
                @{auth.user.uniqueId}
              </p>
            )}
            {auth.user.email && (
              <p style={{ color: 'var(--text-disabled)', fontSize: '0.75rem', marginBottom: '8px' }}>
                {auth.user.email}
              </p>
            )}

            {/* Status */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: 'var(--success-bg)',
                borderRadius: 'var(--radius-full)',
                marginBottom: '24px',
              }}
            >
              <div className="status-dot status-online" style={{ border: 'none' }} />
              <span style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: '600' }}>Online</span>
            </div>

            {/* Close Action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setShowOwnProfile(false)}
                className="btn btn-secondary btn-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Create Group Modal */}
      {createPortal(
        <CreateGroup
          isOpen={showCreateGroup}
          onClose={() => setShowCreateGroup(false)}
          onCreated={(room) => {
            setSelectedRoom(room);
          }}
        />,
        document.body
      )}
    </div>
  );
}

export default MainLayout;
