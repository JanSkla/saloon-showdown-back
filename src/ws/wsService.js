import { startGame, startGameWithCountdown } from "../utils/game.js";
import { createRoom, getPublicInLobbyRooms, getRoomByCode, joinPlayerToRoom } from "../utils/roomsData.js";
import { MakeCreateRoomMsg, MakeErrorJointRoomMsg, MakeJointRoomMsg, MakeLoadGameMessage, MakePublicLobbiesMessage, ParsePlayersDataForFrontEnd } from "../utils/serverToClientMessages.js";
import { areAllPlayersLoaded, makeRandomString, sendToAllInRoom } from "../utils/utils.js";

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
    ws.send(JSON.stringify(MakeErrorJointRoomMsg()));
    ws.close();
    return false;
  }

  const joinData = joinPlayerToRoom(room, { name: name, ws: ws });


  const response = !!joinData ? MakeJointRoomMsg( code,  joinData.player.pId, ParsePlayersDataForFrontEnd(room)) : {status: 400};

  ws.send(JSON.stringify(response));

  return joinData;
}

export const startGameService = (room) => {
  room.state = "loading"; //TODO: WHEN PLAYER JOINS AFTER 1 ROUND HE DOES NOT GET LOAD MESSAGE
  if(areAllPlayersLoaded(room)) startGameWithCountdown(room);
  else sendToAllInRoom(room, JSON.stringify(MakeLoadGameMessage()));
}

export const gameLoadedService = (room, player) => {

  player.gameLoaded = true;

  if(areAllPlayersLoaded(room)) startGameWithCountdown(room);
}

export const getPublicInLobbyRoomsService = (ws) => {
  ws.send(JSON.stringify(MakePublicLobbiesMessage(getPublicInLobbyRooms())));
}