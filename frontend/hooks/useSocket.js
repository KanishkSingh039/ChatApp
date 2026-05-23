import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const auth = useAuth();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!auth.socket) return;

    setConnected(auth.socket.connected);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    auth.socket.on('connect', handleConnect);
    auth.socket.on('disconnect', handleDisconnect);

    return () => {
      auth.socket.off('connect', handleConnect);
      auth.socket.off('disconnect', handleDisconnect);
    };
  }, [auth.socket]);

  return {
    socket: auth.socket,
    connected,
    socketConnected: auth.socketConnected,
  };
};

export default useSocket;
