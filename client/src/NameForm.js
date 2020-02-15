import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

export default function NameForm() {
  const [playerName, setPlayerName] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = e => {
    e.preventDefault()
    dispatch({
      type: 'SET_NAME',
      name: playerName
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