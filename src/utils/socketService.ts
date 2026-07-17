import { io, Socket } from 'socket.io-client';
import { baseUrl } from '../redux/constant';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(baseUrl, {
      autoConnect: false,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('🔌 Socket Connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket Disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('🔌 Socket Connection Error:', error.message);
    });
  }
  return socket;
};

export const connectSocket = (token: string) => {
  const s = getSocket();

  // Dynamic headers update for socket handshake
  s.io.opts.extraHeaders = {
    authorization: `Bearer ${token}`,
  };

  // Keep auth object as fallback
  s.auth = { token };

  if (!s.connected) {
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
