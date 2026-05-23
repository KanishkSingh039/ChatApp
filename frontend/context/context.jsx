import { createContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { STORAGE_KEYS, SOCKET_URL, SOCKET_EVENTS } from '../utils/config';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    const existingSocket = socket;
    if (existingSocket?.connected) return existingSocket;

    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    newSocket.on(SOCKET_EVENTS.CONNECT, () => {
      setSocketConnected(true);
    });

    newSocket.on(SOCKET_EVENTS.DISCONNECT, () => {
      setSocketConnected(false);
    });

    newSocket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);
    return newSocket;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Resolve user's MongoDB _id via socket
  const resolveUserId = useCallback((socketInstance, userName) => {
    return new Promise((resolve) => {
      if (!socketInstance || !userName) {
        resolve(null);
        return;
      }

      const handleUserId = (data) => {
        if (data.success && data.id) {
          resolve(data.id);
        } else {
          resolve(null);
        }
      };

      socketInstance.once(SOCKET_EVENTS.USER_ID, handleUserId);
      socketInstance.emit(SOCKET_EVENTS.FIND_USER, userName);

      // Timeout after 5 seconds
      setTimeout(() => {
        socketInstance.off(SOCKET_EVENTS.USER_ID, handleUserId);
        resolve(null);
      }, 5000);
    });
  }, []);

  // Restore auth from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);

        // Re-initialize socket and resolve _id if missing
        const sock = initializeSocket();
        if (parsedUser && !parsedUser._id && parsedUser.name) {
          // Wait for socket connect, then resolve _id
          const attemptResolve = () => {
            resolveUserId(sock, parsedUser.name).then((id) => {
              if (id) {
                const updatedUser = { ...parsedUser, _id: id };
                setUser(updatedUser);
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
              }
            });
          };

          if (sock.connected) {
            attemptResolve();
          } else {
            sock.once('connect', attemptResolve);
          }
        }
      }
      catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }

    setLoading(false);
  }, [initializeSocket, resolveUserId]);

  // Login handler
  const login = useCallback(
    async (tokenValue, userData) => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, tokenValue);
      setToken(tokenValue);
      setIsAuthenticated(true);

      const sock = initializeSocket();

      // Resolve _id from socket
      const resolveName = userData.name;
      if (resolveName) {
        const attemptResolve = () => {
          resolveUserId(sock, resolveName).then((id) => {
            const fullUser = { ...userData, _id: id || userData._id };
            setUser(fullUser);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(fullUser));
          });
        };

        if (sock.connected) {
          attemptResolve();
        } else {
          sock.once('connect', attemptResolve);
        }
      } else {
        setUser(userData);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      }
    },
    [initializeSocket, resolveUserId]
  );

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setSocketConnected(false);

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [socket]);

  // Update user helper (for when _id is resolved later)
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    token,
    user,
    isAuthenticated,
    loading,
    socket,
    socketConnected,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;