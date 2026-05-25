import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { SOCKET_EVENTS } from '../utils/config';
import { api } from '../utils/api';

export function ChatRoom({ roomId, roomName, roomMembers = [], sidebarOpen, onToggleSidebar }) {
  const auth = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle virtual keyboard on mobile — keep layout within visible viewport
  const containerRef = useRef(null);
  useEffect(() => {
    if (!isMobile || !window.visualViewport) return;

    const handleViewportResize = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.visualViewport.height}px`;
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportResize);
    window.visualViewport.addEventListener('scroll', handleViewportResize);

    return () => {
      window.visualViewport.removeEventListener('resize', handleViewportResize);
      window.visualViewport.removeEventListener('scroll', handleViewportResize);
    };
  }, [isMobile]);

  // Get display name for room
  const displayName = (() => {
    if (Array.isArray(roomName)) {
      const otherName = roomName.find((n) => n !== auth.user?.name);
      return otherName || roomName[0] || 'Chat';
    }
    return roomName || 'Chat';
  })();

  // Auto-scroll to bottom
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
    });
  };

  // Handle scroll to detect if user scrolled up
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
    setShowScrollButton(!isNearBottom);
  };

  // Fetch message history on room change
  useEffect(() => {
    if (!roomId) return;

    setLoading(true);
    setMessages([]);

    api
      .fetchMessages(roomId)
      .then((data) => {
        
        const msgs = data.content || data.data || [];
        setMessages(Array.isArray(msgs) ? msgs : []);
        // Scroll to bottom after loading
        setTimeout(() => scrollToBottom(false), 50);
      })
      .catch((err) => {
        console.error('Failed to fetch messages:', err);
          auth.logout();
        
        setMessages([]);
      })
      .finally(() => setLoading(false));
  }, [roomId]);

  // Join room and listen for new messages
  useEffect(() => {
    if (!socket || !roomId) return;

    // Join the socket room
    socket.emit(SOCKET_EVENTS.JOIN_CHAT_ROOM, roomId);

    // Listen for new messages — backend emits { storemessage, message }
    const handleNewMessage = (data) => {
      const newMsg = data.storemessage || data.message || data;
      setMessages((prev) => {
        // Deduplicate by _id
        if (newMsg._id && prev.some((m) => m._id === newMsg._id)) {
          return prev;
        }
        return [...prev, newMsg];
      });

      // Auto-scroll if near bottom
      setTimeout(() => {
        if (!messagesContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
        if (isNearBottom) {
          scrollToBottom();
        }
      }, 50);
    };
    socket.on(SOCKET_EVENTS.UPDATE_CHATROOM,(data)=>{      
        setMessages((prev) => prev.filter((m) => m._id !== data.id));

    });
    socket.on(SOCKET_EVENTS.MESSAGE_STORAGE, handleNewMessage);
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_STORAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.UPDATE_CHATROOM);
    }
  }, [socket, roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageInput.trim() || !socket || !roomId) return;

    const message = {
      roomId,
      senderId: auth.user?._id,
      content: messageInput.trim(),
    };

    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, message);
    setMessageInput('');
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Check if message is from current user
  const isOwnMessage = (msg) => {
    return msg.senderId === auth.user?._id;
  };

  // Group messages by date
  const getDateLabel = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  // Determine if we should show date separator
  const shouldShowDate = (msg, prevMsg) => {
    if (!prevMsg) return true;
    const date1 = new Date(msg.createdAt || msg.timestamp).toDateString();
    const date2 = new Date(prevMsg.createdAt || prevMsg.timestamp).toDateString();
    return date1 !== date2;
  };

  // Handle delete message (no logic yet)
  const handleDeleteMessage = (msgId) => {
        socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, msgId);
      return
  };

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* Header */}
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
        {/* Hamburger Menu Toggle — always visible on mobile */}
        <button
          onClick={onToggleSidebar}
          title={isMobile ? 'Open sidebar' : (sidebarOpen ? 'Close sidebar' : 'Open sidebar')}
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
            flexShrink: 0,
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
        <div className="avatar avatar-md avatar-white">
          {displayName?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <h2
            style={{
              fontSize: '0.95rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}
          >
            {displayName}
          </h2>
          {roomMembers.length > 0 && (
            <p style={{ color: 'var(--text-disabled)', fontSize: '0.7rem', marginTop: '2px' }}>
              {roomMembers.length} member{roomMembers.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          position: 'relative',
        }}
      >
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
            <div className="spinner-lg spinner" />
          </div>
        )}

        {messages.length === 0 && !loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--bg-elevated)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  fontSize: '1.4rem',
                }}
              >
                💬
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
                No messages yet
              </p>
              <p style={{ color: 'var(--text-disabled)', fontSize: '0.8rem' }}>
                Send the first message!
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const showDate = shouldShowDate(msg, prevMsg);
          const own = isOwnMessage(msg);
          const msgId = msg._id || index;
          const isSelected = own && selectedMessageId === msgId;

          return (
            <div key={msgId}>
              {/* Date Separator */}
              {showDate && (msg.createdAt || msg.timestamp) && (
                <div className="divider" style={{ margin: '16px 0' }}>
                  {getDateLabel(msg.createdAt || msg.timestamp)}
                </div>
              )}

              {/* Message */}
              <div
                className="animate-message-pop"
                style={{
                  display: 'flex',
                  justifyContent: own ? 'flex-end' : 'flex-start',
                  marginBottom: '6px',
                  animationDelay: loading ? '0ms' : `${Math.min(index * 20, 200)}ms`,
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    minWidth: '60px',
                    position: 'relative',
                  }}
                >
                  {
                    own?
                  (<div
                    className='message-sent'
                    style={{ padding: '10px 14px', cursor: 'pointer' }}
                    onClick={() => setSelectedMessageId(isSelected ? null : msgId)}
                  >
                    <p
                      style={{
                        fontSize: '0.85rem',
                        lineHeight: '1.45',
                        wordBreak: 'break-word',
                        margin: 0,
                      }}
                    >
                      {msg.content}
                    </p>
                    {/* Delete button appears on click */}
                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(msgId);
                        }}
                        title="Delete message"
                        style={{
                          position: 'absolute',
                          top: '50%',
                          right: 'calc(100% + 8px)',
                          transform: 'translateY(-50%)',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-secondary)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ef4444',
                          boxShadow: 'var(--shadow-md)',
                          transition: 'all var(--transition-fast)',
                          animation: 'fadeIn 0.15s ease-out',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#ef4444';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--bg-elevated)';
                          e.currentTarget.style.color = '#ef4444';
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>):
                  <div className='message-received' style={{ padding: '10px 14px' }} >
                    <p
                      style={{
                        fontSize: '0.85rem',
                        lineHeight: '1.45',
                        wordBreak: 'break-word',
                        margin: 0,
                      }}
                    >
                      {msg.content}
                    </p>
                  </div>
                  }
                  <p
                    style={{
                      fontSize: '0.65rem',
                      color: 'var(--text-disabled)',
                      marginTop: '3px',
                      textAlign: own ? 'right' : 'left',
                      paddingLeft: own ? 0 : '4px',
                      paddingRight: own ? '4px' : 0,
                    }}
                  >
                    {formatTime(msg.createdAt || msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div
          style={{
            position: 'absolute',
            bottom: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => scrollToBottom()}
            className="animate-fade-in-up"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '500',
              boxShadow: 'var(--shadow-md)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            ↓ New messages
          </button>
        </div>
      )}

      {/* Message Input */}
      <div
        style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-primary)',
          background: 'var(--bg-surface)',
        }}
      >
        <form
          onSubmit={handleSendMessage}
          style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
        >
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="input-field"
            style={{ flex: 1 }}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="btn btn-primary"
            style={{ padding: '10px 18px', flexShrink: 0 }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
