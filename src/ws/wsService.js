import { joinPlayerToRoom, removePlayer, removeRoom, rooms } from "../utils/roomsData.js";
import { makeRandomString } from "../utils/utils.js"

export const createRoomService = ws => {

  const roomCode = makeRandomString(4);

  const roomIndex = rooms.push({
    roomCode: roomCode,
    players: []
  }) - 1

  const playerIndex = rooms[roomIndex].players.push({ name: "pepik", ws: ws }) - 1

  console.log(rooms);

  ws.send(JSON.stringify({status: 200, data: roomCode}))

  return rooms[roomIndex];
}

export const joinRoomService = (ws, code) => {

  const playerIndex = joinPlayerToRoom({ name: "pepik", ws: ws }, code);

  console.log(rooms);

  const status = playerIndex == false ? 400 : 200; 

  ws.send(JSON.stringify({status: status}))

  return { room: rooms[roomIndex], player: rooms[roomIndex].players[playerIndex] };
}