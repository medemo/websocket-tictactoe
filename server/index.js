const { createServer } = require('http')
const express = require('express');
const cors = require('cors')
const socketIO = require('socket.io')
const uuid = require('uuid/v1')

const app = express();
var http = createServer(app)
const io = socketIO(http);


const rooms = {}

app.use(cors())

app.get('/rooms', (req, res) => {
  res.json(rooms)
})


io.on("connection", function (socket) {
  socket.on('create-room', ({ room, player }) => {
    const roomId = uuid()
    rooms[roomId] = {
      name: room,
      players: [
        {
          id: socket.id,
          name: player
        }
      ],
      board: Array(9).fill(),
      lastTurn: ''
    }
    io.emit('rooms-updated', rooms)
    socket.join(roomId, () => {
      socket.emit('room-joined', roomId)
    })
  })

  socket.on('join-room', ({ room: roomId, player }) => {
    if (rooms[roomId].players.length >= 2 || rooms[roomId].players[0].id === socket.id) return
    rooms[roomId].players.push({ id: socket.id, name: player })
    socket.join(roomId, () => {
      io.emit('rooms-updated', rooms)
      io.to(roomId).emit('room-updated', { id: roomId, ...rooms[roomId] })
      socket.emit('room-joined', roomId)
    })
  })

  socket.on('leave-room', roomId => {
    const playerIndex = rooms[roomId].players.findIndex(p => p.id === socket.id)
    rooms[roomId].players.splice(playerIndex, 1)
    if (rooms[roomId].players.length === 0) delete rooms[roomId]
    io.emit('rooms-updated', rooms)
    socket.leave(roomId, () => {
      socket.emit('room-joined', null)
    })
  })

  socket.on('make-move', ({ room: roomId, index }) => {
    if (
      rooms[roomId].board[index]
      || rooms[roomId].lastTurn === socket.id
    ) return
    const player = rooms[roomId].players.find(p => p.id === socket.id)
    rooms[roomId].board[index] = player.name
    rooms[roomId].lastTurn = socket.id
    io.to(roomId).emit('room-updated', { id: roomId, ...rooms[roomId] })
  })
});


http.listen(3000, function () {
  console.log('listening on *:3000');
});

