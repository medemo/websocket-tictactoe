import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import socket from '../socket'

export function useRooms() {
  const rooms = useSelector(state => state.rooms)
  const joinedRoomId = useSelector(state => state.joinedRoomId)
  const dispatch = useDispatch()

  useEffect(() => {
    const updateRooms = rooms => {
      dispatch({
        type: 'ROOMS_UPDATED',
        rooms: filterAvailableRooms(rooms, [joinedRoomId])
      })
    }

    fetch('http://localhost:3000/rooms')
      .then(res => res.json())
      .then(updateRooms)

    socket.on('rooms-updated', updateRooms)

    return () => {
      socket.off('rooms-updated', updateRooms)
    }

  }, [dispatch, joinedRoomId])

  return rooms
}

export function useJoinedRoom() {
  const rooms = useSelector(state => state.rooms)
  const joinedRoomId = useSelector(state => state.joinedRoomId)

  const dispatch = useDispatch()

  useEffect(() => {
    const updateJoinedRoomId = roomId => {
      dispatch({
        type: 'ROOM_JOINED',
        roomId
      })
    }

    const updateJoinedRoom = room => {
      dispatch({
        type: 'ROOM_UPDATED',
        room
      })
    }

    socket.on('room-joined', updateJoinedRoomId)
    socket.on('room-updated', updateJoinedRoom)

    return () => {
      socket.off('room-joined', updateJoinedRoomId)
      socket.off('room-updated', updateJoinedRoom)
    }
  }, [dispatch])

  return rooms.find(room => room.id === joinedRoomId)
}

function filterAvailableRooms(rooms, includedRoomsId = []) {
  return Object.entries(rooms)
    .filter(([id, data]) => data.players.length < 2 || includedRoomsId.includes(id))
    .map(([id, data]) => ({ id, ...data }))
}