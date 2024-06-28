import { startGame } from "../utils/game.js";
import { createRoom, getRoomByCode, joinPlayerToRoom } from "../utils/roomsData.js";
import { MakeCreateRoomMsg, MakeErrorJointRoomMsg, MakeGameStartedMessage, MakeJointRoomMsg, MakeStartCountdownMessage, ParsePlayersDataForFrontEnd } from "../utils/serverToClientMessages.js";
import { makeRandomString, sendToAllInRoom } from "../utils/utils.js";

export const createRoomService = ws => {
  
  const roomCode = makeRandomString(4);

  const joinData = createRoom({ name: "pepik", ws: ws }, roomCode);

  ws.send(JSON.stringify(MakeCreateRoomMsg(roomCode, joinData.player.pId, ParsePlayersDataForFrontEnd(joinData.room))));

  return joinData;
}

export const joinRoomService = (ws, code) => {

  const room = getRoomByCode(code);

  console.log(room.state, "roomstate join")

  if (room.state != "lobby" && room.state != "game-over"){
    ws.send(JSON.stringify(MakeErrorJointRoomMsg()));
    ws.close();
    return;
  }

  const joinData = joinPlayerToRoom(room, { name: "pepik", ws: ws });


  const response = !!joinData ? MakeJointRoomMsg( code,  joinData.player.pId, ParsePlayersDataForFrontEnd(room)) : {status: 400};

  ws.send(JSON.stringify(response));

  return joinData;
}

export const startGameService = (room) => {
  room.state = "loading";

  sendToAllInRoom(room, JSON.stringify(MakeStartCountdownMessage()));

  setTimeout(() => {
    sendToAllInRoom(room, JSON.stringify(MakeGameStartedMessage()));
    startGame(room);
  }, 3000);
}