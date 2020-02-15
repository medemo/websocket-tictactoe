import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import socket from './socket'
import { useRooms } from './hooks'


export default function Home() {
  const playerName = useSelector(state => state.name)
  const rooms = useRooms()
  const [roomName, setRoomName] = useState('')

  const handleCreateRoom = e => {
    e.preventDefault()
    socket.emit('create-room', { room: roomName, player: playerName })
    setRoomName('')
  }

  const joinRoom = roomId => {
    socket.emit('join-room', { room: roomId, player: playerName })
  }


  return (
    <div>
      <form onSubmit={handleCreateRoom}>
        <p>Input room name</p>
        <input value={roomName} onChange={e => setRoomName(e.target.value)} />
        <br />
        <br />
        <button type="submit">CREATE ROOM</button>
      </form>
      <br />
      <div style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {
          rooms.map(room => {
            return (
              <div key={room.id} style={{
                border: 'solid black 1px',
                height: 120,
                width: 140,
                textAlign: 'center'
              }}>
                <p>{room.name}</p>
                <p>rival: {room?.players[0]?.name}</p>
                <button onClick={() => joinRoom(room.id)}>JOIN</button>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}