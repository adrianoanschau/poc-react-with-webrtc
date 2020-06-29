import io from 'socket.io-client';

export const socket = io('192.168.0.10:5000', { path: '/bridge' });
