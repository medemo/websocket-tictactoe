import { createStore } from 'redux'

const initialState = {
  name: '',
  rooms: [],
  joinedRoomId: null
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.name
      }
    case 'ROOMS_UPDATED':
      return {
        ...state,
        rooms: action.rooms
      }
    case 'ROOM_UPDATED':
      const index = state.rooms.findIndex(r => r.id === action.room.id)
      if (index === -1) return state
      return {
        ...state,
        rooms: [
          ...state.rooms.slice(0, index),
          action.room,
          ...state.rooms.slice(index + 1),
        ]
      }
    case 'ROOM_JOINED':
      return {
        ...state,
        joinedRoomId: action.roomId
      }
    default:
      return state
  }
}

export default createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)