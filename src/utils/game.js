import { CHOOSE_TIME, GATHER_TIME, PROCESS_TIME } from "../config.js";
import { MakeAmmoMsg, MakeBlockMsg, MakeFinishedBeerMsg, MakeGameOverMsg, MakeOrderBeerMsg, MakeRecievedBeerMsg, MakeRoundActionsMsg, MakeShootBeerMsg, MakeShootBlockMsg, MakeShootDamageMsg, MakeShootDeathMsg, MakeStartedBeerMsg } from "./serverToClientMessages.js";
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

  if(playerData.beer == false) options.push("order-beer");
  if(playerData.beer == "ready") options.push("drink-beer");

  return options;
}

const processChoices = (room) => {

  const roundSummary = [];

  const beerDrinkers = [];

  room.gameData.playerData.forEach(data =>{

    let tempBeerState = data.beer;


    if(data.beer == "waiting"){
      tempBeerState = "ready";
      roundSummary.push(MakeRecievedBeerMsg(data.pId));
    }
    
    if(data.choice.type == undefined){
      //TODO: do smthing on no call
    }
    else{
      if (!data.options.find(option => option == data.choice.type)) console.log("wrong call") //TODO: do smthing on wrong call
      else{

        switch (data.choice.type){
          case "ammo":
            data.ammo++;

            roundSummary.push(MakeAmmoMsg(data.pId));
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
                roundSummary.push(MakeShootDeathMsg(data.pId, targetPlayerData.pId));

                console.log("player " + targetPlayerData.pId + " died");
                room.gameData.playerData.splice(i, 1);
              }
              else{
                if(targetPlayerData.beer){
                  targetPlayerData.beer = false;
                  roundSummary.push(MakeShootBeerMsg(data.pId, targetPlayerData.pId));
                }
                roundSummary.push(MakeShootDamageMsg(data.pId, targetPlayerData.pId));
              }
            }
            else
              roundSummary.push(MakeShootBlockMsg(data.pId, targetPlayerData.pId));
            break;
          case "block":

            roundSummary.push(MakeBlockMsg(data.pId));
            break;
          case "order-beer":
            if(data.beer == false){
              tempBeerState = "waiting";
              roundSummary.push(MakeOrderBeerMsg(data.pId));
            }
            break;
          case "drink-beer":
            if(data.beer == "ready"){
              tempBeerState = false; //need to resolve shoot first drink later
              beerDrinkers.push(data);
            }
            break;
        }
      }
    }

    data.beer = tempBeerState;
  });

  beerDrinkers.forEach(chronicDrinker => {
    
    if (chronicDrinker.health <= 0){
      roundSummary.push(MakeStartedBeerMsg(chronicDrinker.pId))
    }
    else{
      chronicDrinker.health += 1;
      roundSummary.push(MakeFinishedBeerMsg(chronicDrinker.pId))
    }
  })

  console.log("gameData", room.gameData);

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

  sendToAllInRoom(room, JSON.stringify(MakeRoundActionsMsg(roundSummary)));

  if (room.gameData.playerData.length == 1){
    const winner = room.gameData.playerData[0];
    room.state = "game-over";
    sendToAllInRoom(room, JSON.stringify(MakeGameOverMsg(winner.pId)));
    return;
  }

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