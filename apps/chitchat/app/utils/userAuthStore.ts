import axiosInstance from './axiosConfig';
import socket from './socket';

export const sendMessage = async ({ to, content, mediaBase64, mediaType }) => {
  const res = await axiosInstance.post(`/message/send/${to}`, {
    content,
    mediaBase64,
    mediaType,
  });

  socket.emit('send');
};
