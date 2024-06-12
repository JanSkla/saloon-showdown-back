import { createRoom, joinPlayerToRoom } from "../utils/roomsData.js";
import { makeRandomString } from "../utils/utils.js";

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