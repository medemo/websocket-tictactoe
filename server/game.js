const uuid = require('uuid/v1')

const emitter = require('./emitter')


class Room {
  constructor(name) {
    this.id = uuid()
    this.name = name
    this.players = []
    this.board = Array(9).fill()
    this.status = 0
    this.lastTurn = null
    this.updatedAt = Date.now()
  }

  join(player) {
    if (this.players.length > 2 || this.players.includes(player)) return
    this.players.push(player)
    if (this.players.length === 2) {
      this.status = 2
    } else {
      this.status = 1
    }
    this._notify()
  }

  leave(player) {
    const index = this.players.indexOf(player)
    if (index === -1) return
    this.players.splice(index, 1)
    this.status = 0
    this._notify()
  }

  makeMove(player, index) {
    const playerIndex = this.players.indexOf(player)

    if (
      playerIndex === -1
      || this.board[index]
      || this.lastTurn === player
    ) return

    this.board[index] = playerIndex
    this.lastTurn = player

    this._notify()
  }

  _notify() {
    this.updatedAt = Date.now()
    emitter.emit('room', this.id)
    emitter.emit('rooms')
  }
}


class TicTacToe {
  constructor() {
    this._rooms = {}
    this._clearUnusedRoomsPeriodically()
  }

  create(name) {
    const room = new Room(name)
    this._rooms[room.id] = room

    return room.id
  }

  get(id) {
    return this._rooms[id]
  }

  getAvailableRooms() {
    return Object.values(this._rooms)
      .filter(room => room.status === 1)
  }

  _clearUnusedRoomsPeriodically(period = 6e4) {
    setInterval(() => {
      for (let room of Object.values(this._rooms)) {
        if (room.status === 0 || (Date.now() - room.updatedAt) > period)
          delete this._rooms[room.id]
      }
    }, period)
  }
}


module.exports = new TicTacToe()
