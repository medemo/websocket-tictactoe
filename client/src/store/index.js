import { createStore } from 'redux'


const initialState = {
  player: null,
  rooms: [],
  joinedRoom: null
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_PLAYER':
      return {
        ...state,
        player: action.player
      }
    case 'ROOMS_UPDATED':
      return {
        ...state,
        rooms: action.rooms
      }
    case 'JOINED_ROOM_UPDATED':
      return {
        ...state,
        joinedRoom: action.room
      }
    default:
      return state
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
