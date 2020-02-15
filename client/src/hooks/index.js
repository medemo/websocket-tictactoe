import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import socket from '../socket'

export function useRooms() {
  const rooms = useSelector(state => state.rooms)
  const dispatch = useDispatch()

  useEffect(() => {
    socket.emit('get-rooms')

    const updateRooms = rooms => {
      dispatch({
        type: 'ROOMS_UPDATED',
        rooms
      })
    }

    if (!socket.hasListeners('rooms')) {
      socket.on('rooms', updateRooms)

      return () => {
        socket.off('rooms', updateRooms)
      }
    }
  }, [dispatch])

  return rooms
}


export function useJoinedRoom(component) {
  const joinedRoom = useSelector(state => state.joinedRoom)

  const dispatch = useDispatch()

  useEffect(() => {
    const updateJoinedRoom = room => {
      const updatedRoom = room.status === 0 ? null : room
      dispatch({
        type: 'JOINED_ROOM_UPDATED',
        room: updatedRoom
      })
    }

    if (!socket.hasListeners('joined-room')) {
      socket.on('joined-room', updateJoinedRoom)

      return () => {
        socket.off('joined-room', updateJoinedRoom)
      }
    }
  }, [dispatch])

  return joinedRoom
}
