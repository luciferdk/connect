import API from './axios';
import socket from './socket';

export const sendMessage = async ({to, content, mediaBase64, mediaType}) => {
	const res = await API.post(`/message/send/${to}`, {
		content,
		mediaBase64,
		mediaType,

	});

	socket.emit('send')
}
