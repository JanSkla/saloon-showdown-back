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
      ammo: 0,
      health: 3,
      beer: false
    })
  });

  chooseEvent(room);
}

const getOptions = (playerData) => {

  const options = ["block", "ammo"];

  if(playerData.ammo > 0) options.push("shoot");

  if(playerData.beer == false || playerData.beer == "ready") options.push("beer");

  return options;
}

const processChoices = (room) => {

  const roundSummary = [];

  room.gameData.playerData.forEach(data =>{
    if(data.choice.type == undefined){
      //TODO: do smthing on no call
    }
    else{
      if (!data.options.find(option => option == data.choice.type)) console.log("wrong call") //TODO: do smthing on wrong call
      else{

        let tempBeerState;


        if(data.beer == "waiting"){
          tempBeerState = "ready";
          roundSummary.push(data.pId + "recieved a beer")
        }

        switch (data.choice.type){
          case "ammo":
            data.ammo++;

            roundSummary.push(data.pId + "added ammo")
            break;
          case "shoot":
            const targetPlayerData = room.gameData.playerData.find(pData=> pData.pId == data.choice.target);
            if (!targetPlayerData){
              console.log("target player does not exist");
              break;
            }
            data.ammo -= 1;
            if(targetPlayerData.choice.type != "block"){
              targetPlayerData.health -= 1;
              if (targetPlayerData.health < 1){
                const i = room.gameData.playerData.indexOf(targetPlayerData);
                roundSummary.push(data.pId + "shoots at target: " + targetPlayerData.pId + " target died");

                console.log("player " + targetPlayerData.pId + " died");
                room.gameData.playerData.splice(i, 1);
              }
              else{
                roundSummary.push(data.pId + "shoots at target: " + targetPlayerData.pId + " target damaged");
              }
            }
            else
              roundSummary.push(data.pId + "shoots at target: " + targetPlayerData.pId + " shot was blocked");
            break;
          case "block":

            roundSummary.push(data.pId + "is blocking")
            break;
          case "beer":
            if(data.beer == false){
              tempBeerState = "waiting";
              roundSummary.push(data.pId + "ordered a beer")
            }
            else if(data.beer == "ready"){
              tempBeerState = false;
              data.health += 1;
              roundSummary.push(data.pId + "used a beer")
            }
            break;
        }
        data.beer = tempBeerState;
      }
    }
  });
  return roundSummary;
}

const chooseEvent = (room) => {
  if (room.players.length < 1) return;

  room.gameData.state = "choose";

  room.gameData.playerData.forEach(playerData => {
    
    const player = getPlayerByPIdAndRoom(room, playerData.pId);

    if (!player){
      console.log("playerDoesNotExist")
      return;
    }


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

const processEvent = (room) => {
  room.gameData.state = "processing";

  console.log(room.gameData.state)
  console.log(room.gameData.playerData)
  
  sendToAllInRoom(room, "processing choices");

  const roundSummary = processChoices(room);

  sendToAllInRoom(room, JSON.stringify(roundSummary))

  setTimeout(() => chooseEvent(room), PROCESS_TIME);
}

export const handlePlayerChoice = (room, player, data) => {
  const choiceData = { type: data.choice }

  if(choiceData.type == "shoot") choiceData.target = data.target;

  const playerData = room.gameData.playerData.find(data => data.pId == player.pId)
  if(!playerData){
    console.log("playerData was not found");
    return;
  }
  playerData.choice = choiceData;
}