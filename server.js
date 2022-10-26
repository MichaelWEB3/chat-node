const express = require('express')
const path = require('path')
const http = require('http')
const socktIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socktIO(server)

server.listen(3000)
app.use(express.static(path.join(__dirname, 'public')))

let conectetUsers = []
io.on('connection', (socket) => {
    console.log('connectado estabelecida')
    socket.on('join-request', (username) => {
        socket.username = username
        conectetUsers.push(username)
        console.log(conectetUsers)
        socket.emit('user-ok', conectetUsers)
        socket.broadcast.emit('list-update', {
            joinend: username,
            list: conectetUsers
        })
    })

    socket.on('disconnect', () => {
        conectetUsers = conectetUsers.filter((users, i) => users != socket.username)
        console.log(conectetUsers)
        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: conectetUsers
        })
    })

    socket.on('send-msg', text => {
        const obj = {
            userName: socket.username,
            msg: text
        }
        socket.emit('show-msg', obj)
        socket.broadcast.emit('show-msg', obj)
    })
})
