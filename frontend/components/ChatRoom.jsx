import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { SOCKET_EVENTS } from '../utils/config';
import { api } from '../utils/api';

export function ChatRoom({ roomId, roomName, roomMembers = [], roomType, sidebarOpen, onToggleSidebar }) {
  const auth = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Image lightbox state
  const [lightboxUrl, setLightboxUrl] = useState(null);
  // Right-click context menu state
  const [contextMenu, setContextMenu] = useState(null); // { x, y, msgId }
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

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
    socket.on(SOCKET_EVENTS.UPDATE_CHATROOM, (data) => {
      setMessages((prev) => prev.filter((m) => m._id !== data.id));

    });
    socket.on(SOCKET_EVENTS.MESSAGE_STORAGE, handleNewMessage);
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_STORAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.UPDATE_CHATROOM);
    }
  }, [socket, roomId]);

  // File selection handler — add your upload logic here
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSelectedFile(file);
    const uploadatcloudinary = await api.uploadatcloudinary(file);
    // console.log("uploaded", uploadatcloudinary);

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    // Encode the original filename into the URL so we can display it in chat
    const fileUrl = uploadatcloudinary.url + '?fn=' + encodeURIComponent(file.name);
    
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      category: 'file',
      url: fileUrl,
      senderId: auth.user?._id,
      roomId
    });

    // Clear file state after sending
    clearSelectedFile();
  };

  // Cancel selected file
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

  // Close context menu on any click or scroll
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    window.addEventListener('scroll', closeMenu, true);
    return () => {
      window.removeEventListener('click', closeMenu);
      window.removeEventListener('scroll', closeMenu, true);
    };
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setLightboxUrl(null);
        setContextMenu(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Check if content is an image URL
  const isImageUrl = (text) => {
    if (!text) return false;
    // Strip the ?fn= query param for checking extension
    const base = text.split('?')[0];
    // Explicit image extensions
    if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(base)) return true;
    // Cloudinary URLs that are NOT pdfs and NOT other doc types
    if (text.includes('res.cloudinary.com') && !isPdfUrl(text) && !isDocUrl(text)) return true;
    return false;
  };

  // Check if content is a PDF URL
  const isPdfUrl = (text) => {
    if (!text) return false;
    const base = text.split('?')[0];
    return /\.pdf$/i.test(base);
  };

  // Check if content is a document (non-image) URL
  const isDocUrl = (text) => {
    if (!text) return false;
    const base = text.split('?')[0];
    return /\.(doc|docx|txt|zip|rar|xls|xlsx|ppt|pptx|csv)$/i.test(base);
  };

  // Extract the original filename from the ?fn= param, or fall back to URL path
  const getFileNameFromUrl = (url) => {
    try {
      const parsed = new URL(url);
      // Check for our encoded original filename
      const fn = parsed.searchParams.get('fn');
      if (fn) return fn;
      // Fallback: use last path segment
      const segments = parsed.pathname.split('/').filter(Boolean);
      const last = segments[segments.length - 1];
      return last || 'file';
    } catch {
      return 'file';
    }
  };

  // Get file extension from URL
  const getFileExtension = (url) => {
    try {
      const pathname = new URL(url).pathname;
      const ext = pathname.split('.').pop()?.toLowerCase();
      return ext || '';
    } catch {
      return '';
    }
  };

  // Render a file-category message (image inline with lightbox, or file card)
  const renderFileMessage = (url) => {
    if (!url) return <span style={{ color: 'var(--text-disabled)', fontStyle: 'italic' }}>File unavailable</span>;

    // === IMAGE: show inline, click opens lightbox ===
    if (isImageUrl(url)) {
      return (
        <div
          onClick={(e) => { e.stopPropagation(); setLightboxUrl(url); }}
          style={{ display: 'block', cursor: 'pointer' }}
          title="Click to view full image"
        >
          <img
            src={url}
            alt="shared image"
            style={{
              maxWidth: '100%',
              maxHeight: '240px',
              borderRadius: 'var(--radius-md, 8px)',
              objectFit: 'cover',
              transition: 'transform 0.15s ease, filter 0.15s ease',
            }}
            loading="lazy"
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.85)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
          />
        </div>
      );
    }

    // === PDF / OTHER FILE: show file card, click opens in new tab ===
    const fileName = getFileNameFromUrl(url);
    const ext = getFileExtension(url).toUpperCase();
    const isPdf = isPdfUrl(url);

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="file-card-link"
      >
        {/* File type icon */}
        <div className={`file-card-icon ${isPdf ? 'file-card-icon-pdf' : ''}`}>
          {isPdf ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="file-card-name">
            {fileName}
          </p>
          <p className="file-card-meta">
            {ext ? `${ext} file` : 'File'} · Tap to open
          </p>
        </div>
        {/* Open icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    );
  };

  // Render message content — detect image URLs and render inline with lightbox
  const renderContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (isImageUrl(trimmed)) {
        return (
          <div
            key={i}
            onClick={(e) => { e.stopPropagation(); setLightboxUrl(trimmed); }}
            style={{ display: 'block', marginTop: i > 0 ? '6px' : 0, cursor: 'pointer' }}
            title="Click to view full image"
          >
            <img
              src={trimmed}
              alt="shared"
              style={{
                maxWidth: '100%',
                maxHeight: '240px',
                borderRadius: 'var(--radius-md, 8px)',
                objectFit: 'cover',
                transition: 'filter 0.15s ease',
              }}
              loading="lazy"
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.85)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
            />
          </div>
        );
      }
      return trimmed ? <span key={i} style={{ display: 'block' }}>{trimmed}</span> : null;
    });
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

  // Handle delete message
  const handleDeleteMessage = (msgId) => {
    socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, msgId);
    setContextMenu(null);
  };

  // Right-click handler for own messages — position menu to the LEFT of the bubble
  const handleContextMenu = useCallback((e, msgId) => {
    e.preventDefault();
    e.stopPropagation();
    // Find the message bubble element to position menu to its left
    const bubble = e.currentTarget;
    const rect = bubble.getBoundingClientRect();
    // Place context menu to the left of the bubble, vertically centered
    setContextMenu({
      x: rect.left - 180,  // menu width ~170px + gap
      y: rect.top + rect.height / 2 - 20, // roughly center vertically
      msgId,
    });
  }, []);

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
              {roomType === 'friend' ? 'Direct message' : `${roomMembers.length} member${roomMembers.length !== 1 ? 's' : ''}`}
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
                    own ?
                      (<div
                        className='message-sent'
                        style={{
                          padding: msg.category === 'file' ? '0' : '10px 14px',
                          overflow: 'hidden',
                        }}
                        onContextMenu={(e) => handleContextMenu(e, msgId)}
                      >
                        <div
                          style={{
                            fontSize: '0.85rem',
                            lineHeight: '1.45',
                            wordBreak: 'break-word',
                            margin: 0,
                          }}
                        >
                          {msg.category === 'file' ? renderFileMessage(msg.content) : renderContent(msg.content)}
                        </div>
                      </div>) :
                      <div
                        className='message-received'
                        style={{
                          padding: msg.category === 'file' && isImageUrl(msg.content) ? '4px' : '10px 14px',
                          overflow: 'hidden',
                        }}
                        onContextMenu={(e) => {
                          if (isOwnMessage(msg)) handleContextMenu(e, msgId);
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.85rem',
                            lineHeight: '1.45',
                            wordBreak: 'break-word',
                            margin: 0,
                          }}
                        >
                          {msg.category === 'file' ? renderFileMessage(msg.content) : renderContent(msg.content)}
                        </div>
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

      {/* === Image Lightbox Overlay === */}
      {lightboxUrl && (
        <div
          className="image-lightbox-overlay"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="lightbox-close-btn"
            onClick={(e) => { e.stopPropagation(); setLightboxUrl(null); }}
            title="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={lightboxUrl}
            alt="Full preview"
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* === Right-click Context Menu === */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="context-menu-item context-menu-item-danger"
            onClick={() => handleDeleteMessage(contextMenu.msgId)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete message
          </button>
        </div>
      )}

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
          borderTop: '1px solid var(--border-primary)',
          background: 'var(--bg-surface)',
        }}
      >
        {/* File Preview Strip */}
        {selectedFile && (
          <div
            style={{
              padding: '10px 20px',
              borderBottom: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'var(--bg-elevated, rgba(255,255,255,0.03))',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {/* Thumbnail or file icon */}
            {filePreview ? (
              <img
                src={filePreview}
                alt="preview"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md, 8px)',
                  objectFit: 'cover',
                  border: '1px solid var(--border-secondary)',
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md, 8px)',
                  background: 'var(--bg-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid var(--border-secondary)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedFile.name}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-disabled)', margin: '2px 0 0' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            {/* Cancel button */}
            <button
              type="button"
              onClick={clearSelectedFile}
              title="Remove file"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Input Row */}
        <div style={{ padding: '14px 20px' }}>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <form
            onSubmit={handleSendMessage}
            style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            {/* Attachment button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Attach file"
              style={{
                background: 'none',
                border: 'none',
                color: selectedFile ? 'var(--accent-primary, #6366f1)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = selectedFile ? 'var(--accent-primary, #6366f1)' : 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={uploading ? 'Uploading...' : 'Type a message...'}
              className="input-field"
              style={{ flex: 1 }}
              autoComplete="off"
              disabled={uploading}
            />
            <button
              type="submit"
              disabled={(!messageInput.trim() && !selectedFile) || uploading}
              className="btn btn-primary"
              style={{ padding: '10px 18px', flexShrink: 0, position: 'relative' }}
            >
              {uploading ? (
                <div className="spinner" style={{ width: '18px', height: '18px' }} />
              ) : (
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
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
