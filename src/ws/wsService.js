import { startGame } from "../utils/game.js";
import { createRoom, joinPlayerToRoom } from "../utils/roomsData.js";
import { makeRandomString, sendToAllInRoom } from "../utils/utils.js";

export const createRoomService = ws => {
  
  const roomCode = makeRandomString(4);

  const joinData = createRoom({ name: "pepik", ws: ws }, roomCode);

  const status = joinData == false ? 400 : 200; 

  ws.send(JSON.stringify({status: status, data: roomCode}))

  return joinData;
}

export const joinRoomService = (ws, code) => {

  const joinData = joinPlayerToRoom({ name: "pepik", ws: ws }, code);


  const status = joinData == false ? 400 : 200; 

  ws.send(JSON.stringify({status: status}))

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