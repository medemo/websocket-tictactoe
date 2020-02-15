import React from 'react'
import { useSelector } from 'react-redux'

import Game from './Game'
import Home from './Home'
import NameForm from './NameForm'
import { useJoinedRoom } from './hooks'


function App() {
  const name = useSelector(state => state.name)
  const joinedRoom = useJoinedRoom()

  if (!name) return <NameForm />
  if (!joinedRoom) return <Home />
  return <Game />
}

export default App
