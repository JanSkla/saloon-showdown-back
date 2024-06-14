import { CHOOSE_TIME, GATHER_TIME, PROCESS_TIME } from "../config.js";
import { getPlayerByPIdAndRoom, sendToAllInRoom } from "./utils.js";

export const startGame = (room) => {
  room.state = "game";

  room.gameData = {
    playerData: []
  };

  room.players.forEach(player => {
    room.gameData.playerData.push({
      pId: player.pId,
      options: [],
      choice: { type: undefined },
      ammo: 0
    })
  });

  chooseEvent(room);
}

const getOptions = (playerData) => {

  const options = ["block", "beer", "ammo"];

  if(playerData.ammo > 0) options.push("shoot");

  return options;
}

const chooseEvent = (room) => {
  if (room.players.length < 1) return;

  room.gameData.state = "choose";

  room.gameData.playerData.forEach(playerData => {
    
    const player = getPlayerByPIdAndRoom(room, playerData.pId);



    playerData.options = getOptions(playerData),
    playerData.choice = { type: undefined }

    player.ws.send(JSON.stringify(playerData.options));
  })

  console.log(room.gameData.state)
  
  sendToAllInRoom(room, "make a choice");

  setTimeout(() => gatherEvent(room), CHOOSE_TIME);
}

const gatherEvent = (room) => {
  room.gameData.state = "gathering"; //gathering tells clients that they should not call any more choose calls, it's a delay for previous ones to finish
  console.log(room.gameData.state)

  sendToAllInRoom(room, "gathering choices");

  setTimeout(() => processEvent(room), GATHER_TIME);
}

const processEvent = (room ) => {
  room.gameData.state = "processing";

  console.log(room.gameData.state)
  console.log(room.gameData.playerData)
  
  sendToAllInRoom(room, "processing choices");

  setTimeout(() => chooseEvent(room), PROCESS_TIME);
}

export const handlePlayerChoice = (room, player, data) => {
  const choiceData = { type: data.choice }

  if(choiceData.type == "shoot") choiceData.target = data.target;

  const playerData = room.gameData.playerData.find(data => data.pId == player.pId)
  playerData.choice = choiceData;
}