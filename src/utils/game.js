import { CHOOSE_TIME, GATHER_TIME, PROCESS_TIME } from "../config.js";
import { sendToAllInRoom } from "./utils.js";

export const startGame = (room) => {
  room.state = "game";
  room.gameData = undefined;

  chooseEvent(room);
}

const chooseEvent = (room) => {
  if (room.players.length < 1) return;
  
  room.gameData = {
    choices: [],
    state: "choose"
  };

  console.log(room.gameData.state)

  sendToAllInRoom(room, "make a choice");

  setTimeout(() => gatherEvent(room), CHOOSE_TIME);
}

const gatherEvent = (room) => {
  room.gameData.state = "gathering";
  console.log(room.gameData.state)

  sendToAllInRoom(room, "gathering choices");

  setTimeout(() => processEvent(room), GATHER_TIME);
}

const processEvent = (room ) => {
  room.gameData.state = "processing";
  console.log(room.gameData.state)
  
  sendToAllInRoom(room, "processing choices");

  setTimeout(() => chooseEvent(room), PROCESS_TIME);
}