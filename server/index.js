const SocketIO = require('socket.io')

const game = require('./game')
const Player = require('./Player')
const emitter = require('./emitter')


const io = new SocketIO()

io.on('connection', function onConnection(socket) {
  socket.emit('welcome', socket.id)

  const player = new Player(socket)

  socket.on('set-name', name => {
    player.name = name
  })

  socket.on('get-rooms', () => {
    socket.emit('rooms', game.getAvailableRooms())
  })

  socket.on('create-room', name => {
    const roomId = game.create(name)
    socket.join(roomId)
    game.get(roomId).join(player)
  })

  socket.on('join-room', roomId => {
    const room = game.get(roomId)
    if (room) {
      socket.join(roomId)
      room.join(player)
    }
  })

  socket.on('leave-room', roomId => {
    const room = game.get(roomId)
    if (room) {
      room.leave(player)
      socket.leave(roomId)
      socket.to(roomId).emit('user-leaved', player)
    }
  })

  socket.on('make-move', ({ room: roomId, index }) => {
    const room = game.get(roomId)
    if (room)
      room.makeMove(player, index)
  })
})


const compareAvailableRooms = (() => {
  let lastAvailableRooms = []
  return () => {
    const availableRooms = game.getAvailableRooms()
    if (JSON.stringify(lastAvailableRooms) !== JSON.stringify(availableRooms)) {
      io.emit('rooms', availableRooms)
      lastAvailableRooms = availableRooms
    }
  }
})()

emitter.on('rooms', compareAvailableRooms)

emitter.on('room', roomId => {
  io.to(roomId).emit('joined-room', game.get(roomId))
})


io.listen(3000)
