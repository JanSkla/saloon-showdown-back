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

export const createRoom = (playerData, roomCode) => {

  const roomIndex = rooms.push({
    roomCode: roomCode,
    players: []
  }) - 1;

  rooms[roomIndex].players.push(playerData);

  const room = rooms[roomIndex]
  const player = room.players[0]; //there is always only 1 player at start

  return {room: room, player: player};
}

export const joinPlayerToRoom = (playerData, code) => {
  const room = rooms.find(room => room.roomCode == code); 
  
  if (!room) return false;

  const playerIndex = room.players.push(playerData) - 1;

  return {room: room, player: room.players[playerIndex]};
}

export const wsSendToAllInRoom = (romIndex) => {

}