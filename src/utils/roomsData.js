export const rooms = [];

export const removeRoom = (index) => {
  rooms.splice(index - 1, 1);
}

export const removePlayer = (roomIndex, playerIndex) => {
  rooms[roomIndex].players.splice(playerIndex - 1, 1);
  if (rooms[roomIndex].players.length < 1){
    removeRoom(roomIndex);
  }
}

export const joinPlayerToRoom = (playerData, code) => {
  const room = rooms.find(room => room.roomCode == code); 
  
  if (!room) return false;

  return room.players.push(playerData) - 1;
}