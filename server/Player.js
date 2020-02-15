class Player {
  constructor(socket, name) {
    this.id = socket.id
    this._name = name || 'anonymous'
  }

  get name() {
    return this._name
  }

  set name(newName) {
    this._name = newName
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name
    }
  }
}

module.exports = Player
