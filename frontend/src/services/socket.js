import { io } from 'socket.io-client';
import { API_URL } from '../utils/constants';

const SOCKET_URL = API_URL.replace('/api', '');

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true
    });
  }

  return socket;
};

export const connectUserRoom = (userId) => {
  if (!userId) return;
  const activeSocket = getSocket();

  if (activeSocket.connected) {
    activeSocket.emit('join_user_room', userId);
  } else {
    activeSocket.on('connect', () => {
      activeSocket.emit('join_user_room', userId);
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};