import express from 'express'
import auth_routes from './routes/auth.routes.js'
import dotenv from 'dotenv'
import { connect_to_db } from './lib/db.js'
import cookie_parser from 'cookie-parser'
import message_routes from './routes/message.routes.js'
import cors from 'cors'
import { app, server } from './lib/socket.js'
import path from 'path'

dotenv.config()
const port = process.env.PORT
const __dirname = path.resolve()

app.use(express.json({ limit: '10mb' }))
app.use(cookie_parser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api/auth', auth_routes)
app.use('/api/messages', message_routes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.get('/{*splat}', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
    })
}

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    connect_to_db()
})