import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';

export const useMessages = (roomId) => {
  const { socket } = useSocket();
  const auth = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Join room and listen for messages
  useEffect(() => {
    if (!socket || !roomId) return;

    setLoading(true);

    // Join the room
    socket.emit('join-chat-room', roomId);

    // Listen for new messages
    const handleNewMessage = (data) => {
      const newMsg = data.storemessage || data.message || data;
      setMessages((prev) => {
        // Deduplicate
        if (newMsg._id && prev.some((m) => m._id === newMsg._id)) {
          return prev;
        }
        return [...prev, newMsg];
      });
      setLoading(false);
    };

    socket.on('messagestorage', handleNewMessage);

    return () => {
      socket.off('messagestorage', handleNewMessage);
    };
  }, [socket, roomId]);

  const sendMessage = useCallback(
    (content) => {
      if (!socket || !roomId || !auth.user?._id) return;

      socket.emit('sendmessage', {
        roomId,
        content,
        senderId: auth.user._id,
      });
    },
    [socket, roomId, auth.user?._id]
  );

  return {
    messages,
    loading,
    sendMessage,
  };
};

export default useMessages;
