import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import socket from '../socket'

export default function NameForm() {
  const [playerName, setPlayerName] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = e => {
    e.preventDefault()
    socket.emit('set-name', playerName)

    dispatch({
      type: 'SET_PLAYER',
      player: {
        id: socket.id,
        name: playerName
      }
    })

    setPlayerName('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Input your name</p>
      <input value={playerName} onChange={e => setPlayerName(e.target.value)} />
      <br />
      <br />
      <button type="submit">SET NAME</button>
    </form>
  )
}