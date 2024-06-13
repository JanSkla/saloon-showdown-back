export const rooms = [];

let playerIdCounter = 0;

const getNewPlayerId = () => {
  return playerIdCounter++;
}

const addPlayerToRoom = (room, playerData) => {
  playerData.pId = getNewPlayerId();
  console.log(playerData.pId)
  return room.players.push(playerData);
}

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
    players: [],
    state: "lobby"
  }) - 1;

  addPlayerToRoom(rooms[roomIndex], playerData);

  const room = rooms[roomIndex]
  const player = room.players[0]; //there is always only 1 player at start

  room.leadPlayer = player; //set lead player

  return {room: room, player: player};
}

export const joinPlayerToRoom = (playerData, code) => {
  const room = rooms.find(room => room.roomCode == code); 
  
  if (!room) return false;

  const playerIndex = addPlayerToRoom(room, playerData) - 1;

  return {room: room, player: room.players[playerIndex]};
}