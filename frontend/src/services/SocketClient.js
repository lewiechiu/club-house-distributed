import io from 'socket.io-client';

const CONNECTION_PORT = 'http://0.0.0.0:8080';

let socket = io(CONNECTION_PORT, { transports: ['websocket'] });

export default socket;
