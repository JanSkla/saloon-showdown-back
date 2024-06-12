import { joinPlayerToRoom, removePlayer, removeRoom, rooms } from "../utils/roomsData.js";
import { makeRandomString } from "../utils/utils.js"

export const createRoomService = ws => {

  const roomCode = makeRandomString(4);

  const roomIndex = rooms.push({
    roomCode: roomCode,
    players: []
  }) - 1;

  rooms[roomIndex].players.push({ name: "pepik", ws: ws });

  console.log(rooms);

  ws.send(JSON.stringify({status: 200, data: roomCode}))

  const room = rooms[roomIndex]
  const player = room.players[0]; //there is always only 1 player at start

  return {room: room, player: player};
}

export const joinRoomService = (ws, code) => {

  const joinData = joinPlayerToRoom({ name: "pepik", ws: ws }, code);

  console.log(rooms);

  const status = joinData == false ? 400 : 200; 

  ws.send(JSON.stringify({status: status}))

  return joinData;
}