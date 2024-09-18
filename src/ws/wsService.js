import { startGameWithCountdown } from "../utils/game.js";
import { createRoom, getPublicInLobbyRooms, getRoomByCode, joinPlayerToRoom } from "../utils/roomsData.js";
import { MakeCreateRoomMsg, MakeErrorJoinRoomMsg, MakeJoinRoomMsg, MakeLoadedDataMessage, MakeLoadGameMessage, MakePlayerLoadedMessage, MakePlayerReadyMessage, MakePublicLobbiesMessage, MakeRadioMessage, ParsePlayersDataForFrontEnd } from "../utils/serverToClientMessages.js";
import { areAllPlayersReady, getPlayerReadyCount, makeRandomString, sendToAllInRoom } from "../utils/utils.js";

export const createRoomService = (ws, name, isPublic = false) => {
  
  const roomCode = makeRandomString(4);

  const joinData = createRoom({ name: name, ws: ws }, roomCode, isPublic);

  ws.send(JSON.stringify(MakeCreateRoomMsg(roomCode, joinData.player.pId, ParsePlayersDataForFrontEnd(joinData.room))));

  return joinData;
}

export const joinRoomService = (ws, name, code) => {

  const room = getRoomByCode(code);

  console.log(room.state, "roomstate join")

  if (room.state != "lobby" && room.state != "game-over"){
    ws.send(JSON.stringify(MakeErrorJoinRoomMsg()));
    return false;
  }

  const joinData = joinPlayerToRoom(room, { name: name, ws: ws });


  const response = !!joinData ? MakeJoinRoomMsg( code,  joinData.player.pId, joinData.room) : {status: 400};

  ws.send(JSON.stringify(response));

  return joinData;
}

export const startGameService = (room) => {
  room.state = "pre-game"; 

  sendToAllInRoom(room, JSON.stringify(MakeLoadGameMessage(room)));
}

export const readyService = (room, player) => {

  player.ready = true;

  sendToAllInRoom(room, JSON.stringify(MakePlayerReadyMessage(player.pId, getPlayerReadyCount(room))));
  
  if(areAllPlayersReady(room)) startGameWithCountdown(room);
}

export const gameLoadedService = (room, player) => {

  player.gameLoaded = true;

  sendToAllInRoom(room, JSON.stringify(MakePlayerLoadedMessage(player.pId)));

  player.ws.send(JSON.stringify(MakeLoadedDataMessage(room)));

  //if(areAllPlayersLoaded(room)) startGameWithCountdown(room);
}

export const getPublicInLobbyRoomsService = (ws) => {
  ws.send(JSON.stringify(MakePublicLobbiesMessage(getPublicInLobbyRooms())));
}

//RADIO

export const radio = (radioState, room) => {
  room.radio = radioState;
  sendToAllInRoom(room, JSON.stringify(MakeRadioMessage(radioState)));
}