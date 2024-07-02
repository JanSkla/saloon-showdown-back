import { MakeNewLeaderMsg, MakePlayerDisconnectMsg, MakePlayerJoinMsg } from "./serverToClientMessages.js";
import { getRandomName, sendToAllInRoom } from "./utils.js";

export const rooms = [];

let playerIdCounter = 0;

const getNewPlayerId = () => {
  return playerIdCounter++;
}

const addPlayerToRoom = (room, playerData) => {
  playerData.pId = getNewPlayerId();
  console.log(playerData.pId)

  if (!playerData.name)
    playerData.name = getRandomName() + playerData.pId;

  sendToAllInRoom(room, JSON.stringify(MakePlayerJoinMsg(playerData)));

  return room.players.push(playerData);
}

export const removeRoom = (index) => {
  rooms.splice(index, 1);
  console.log("removed room, rooms:", rooms);
}

export const removePlayer = (room, player) => {

  const playerIndex = room.players.indexOf(player);
  const pId = player.pId;

  room.players.splice(playerIndex, 1);

  
  if (room.players.length < 1){
    removeRoom(rooms.indexOf(room));
    return;
  }

  if(room.gameData){
    const deletePlayerDataIndex = room.gameData.playerData.findIndex(data => data.pId == player.pId);
    console.log(deletePlayerDataIndex, "deletePlayerDataIndex")
    if(deletePlayerDataIndex >= 0) room.gameData.playerData.splice(deletePlayerDataIndex, 1);
  }

  room.leadPlayer = room.players[0];

  console.log("player " + pId + " disconnected");
  console.log("player " + room.leadPlayer.pId + " is now room leader");
  sendToAllInRoom(room, JSON.stringify(MakePlayerDisconnectMsg(pId)));
  sendToAllInRoom(room, JSON.stringify(MakeNewLeaderMsg(room.leadPlayer.pId)));
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

export const getRoomByCode = code => {
  const room = rooms.find(room => room.roomCode == code); 
  if (!room) return false;
  return room;
}

export const joinPlayerToRoom = (room, playerData) => {

  const playerIndex = addPlayerToRoom(room, playerData) - 1;

  return {room: room, player: room.players[playerIndex]};
}