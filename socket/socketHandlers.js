function initializeSocketHandlers(io) {
    io.on('connection', (socket) => {
        // Join rooms for disaster/resource/social media updates if needed
        socket.on('join', (room) => {
            socket.join(room);
        });
        // Example: emit test event
        socket.emit('connected', { message: 'WebSocket connected' });
    });
}

module.exports = { initializeSocketHandlers }; 