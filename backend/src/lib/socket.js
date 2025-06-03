import {Server} from 'socket.io'
import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
})

// Used to store online users
const user_socket_map = {} // {user_id: socket_id}

// Takes user_id and returns the corresponding socket id
export function get_receiver_socket_id(user_id) {
    return user_socket_map[user_id]
}

io.on('connection', (socket) => {
    console.log(`A user has connected ${socket.id}`)
    const user_id = socket.handshake.query.user_id
    // If user_id is provided, map it to the socket id
    if (user_id) user_socket_map[user_id] = socket.id
    // Broadcast online users to all connected clients
    io.emit('online_users', Object.keys(user_socket_map))

    socket.on('disconnect', () => {
        console.log(`A user has disconnected ${socket.id}`)
        // Remove the user from the map when they disconnect
        delete user_socket_map[user_id]
        // Broadcast online users to all connected clients
        io.emit('online_users', Object.keys(user_socket_map))
    })
})

export { io, server, app }