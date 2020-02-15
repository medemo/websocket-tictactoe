import React from 'react'
import { useSelector } from 'react-redux'

import Game from './components/Game'
import Home from './components/Home'
import NameForm from './components/NameForm'
import { useJoinedRoom } from './hooks'

function App() {
  const player = useSelector(state => state.player)
  const joinedRoom = useJoinedRoom('app')

  if (!player) return <NameForm />
  if (!joinedRoom) return <Home />
  return <Game />
}

export default App

