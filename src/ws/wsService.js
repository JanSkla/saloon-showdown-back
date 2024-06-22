import { startGame } from "../utils/game.js";
import { createRoom, getRoomByCode, joinPlayerToRoom } from "../utils/roomsData.js";
import { makeRandomString, sendToAllInRoom } from "../utils/utils.js";

export const createRoomService = ws => {
  
  const roomCode = makeRandomString(4);

  const joinData = createRoom({ name: "pepik", ws: ws }, roomCode);

  const status = joinData == false ? 400 : 200; 

  ws.send(JSON.stringify({type: "create-room" ,status: status, code: roomCode, pId: joinData.player.pId}));

  return joinData;
}

export const joinRoomService = (ws, code) => {

  const room = getRoomByCode(code);

  console.log(room.state, "roomstate join")

  if (room.state != "lobby" && room.state != "game-over"){
    ws.send("cannot join a game that is running");
    ws.close();
  }

  const joinData = joinPlayerToRoom(room, { name: "pepik", ws: ws });


  const response = !!joinData ? {type: "join-room" ,status: 200, pId: joinData.player.pId} : {status: 400};

  ws.send(JSON.stringify(response));

  return joinData;
}

export const startGameService = (room) => {
  room.state = "loading";

  sendToAllInRoom(room, "Game starts in 3 seconds");

  setTimeout(() => {
    sendToAllInRoom(room, "START");
    startGame(room);
  }, 3000);
}