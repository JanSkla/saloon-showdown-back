import { CHOOSE_TIME, GATHER_TIME, PROCESS_TIME } from "../config.js";
import { MakeAmmoMsg, MakeBlockMsg, MakeChooseMsg, MakeFinishedBeerMsg, MakeGameOverMsg, MakeGameStartedMessage, MakeOrderBeerMsg, MakeProcessingMsg, MakeRecievedBeerMsg, MakeRoundActionsMsg, MakeShootBeerMsg, MakeShootBlockMsg, MakeShootDamageMsg, MakeShootDeathMsg, MakeShootDrinkingBeerMsg, MakeStartCountdownMessage, MakeStartedBeerMsg, MakeStopChoiceMsg } from "./serverToClientMessages.js";
import { getPlayerByPIdAndRoom, sendToAllInRoom } from "./utils.js";

export const startGame = (room) => {

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

export const startGameWithCountdown = (room) => {
  room.state = "game";

  room.players.forEach(player => {
    player.ready = undefined;
  });

  setTimeout(() => { //ALERT: temporary solution with fixed game start delay, need to consult with @morek

    sendToAllInRoom(room, JSON.stringify(MakeStartCountdownMessage()));
  
    setTimeout(() => {
      sendToAllInRoom(room, JSON.stringify(MakeGameStartedMessage()));
      startGame(room);
    }, 4000);

  }, 1000);
}

const getOptions = (playerData) => {

  const options = ["block"];

  if(playerData.ammo < 6) options.push("ammo");

  if(playerData.ammo > 0) options.push("shoot");

  if(playerData.beer == false) options.push("order-beer");
  if(playerData.beer == "ready") options.push("drink-beer");

  return options;
}

const processChoices = (room) => {

  const roundSummary = [];

  const deaths = [];

  const beerDrinkers = [];
  
  const shootData = [];

  const beerChanges = [];

  room.gameData.playerData.forEach(data =>{

    let tempBeerState = data.beer;


    if(data.beer == "waiting"){
      tempBeerState = "ready";
      roundSummary.push(MakeRecievedBeerMsg(data.pId));
      beerChanges.push({newBeerState: tempBeerState, player: data});
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
            const targetPlayerData = room.gameData.playerData.find(pData=> pData.pId === data.choice.target);
            if (!targetPlayerData){
              console.log("target player does not exist");
              break;
            }
            data.ammo -= 1;
            shootData.push({userId: data.pId,targetPlayer: targetPlayerData})
            break;
          case "block":

            roundSummary.push(MakeBlockMsg(data.pId));
            break;
          case "order-beer":
            if(data.beer == false){
              tempBeerState = "waiting";
              roundSummary.push(MakeOrderBeerMsg(data.pId))
              beerChanges.push({newBeerState: tempBeerState, player: data});
            }
            break;
          case "drink-beer":
            beerDrinkers.push(data);
            break;
        }
      }
    }
  });

  shootData.forEach(({userId, targetPlayer}) => {
    if(targetPlayer.choice.type != "block"){
      targetPlayer.health -= 1;
      if (targetPlayer.health < 1){
        roundSummary.push(MakeShootDeathMsg(userId, targetPlayer.pId));
        deaths.push(targetPlayer);
      }
      else{
        if(targetPlayer.beer == "ready"){
          targetPlayer.beer = false;
          roundSummary.push(MakeShootBeerMsg(userId, targetPlayer.pId));
        }
        
        if(targetPlayer.choice.type == "drink-beer"){
          roundSummary.push(MakeShootDrinkingBeerMsg(userId, targetPlayer.pId));
        }
        else{
          roundSummary.push(MakeShootDamageMsg(userId, targetPlayer.pId, targetPlayer.health));
        }
      }
    }
    else
      roundSummary.push(MakeShootBlockMsg(userId, targetPlayer.pId));
    console.log(targetPlayer)
  })

  deaths.forEach(LOOSER_hahaha => {
    
    const i = room.gameData.playerData.indexOf(LOOSER_hahaha);

    if ( i >= 0){
      console.log("player " + LOOSER_hahaha.pId + " died");
      room.gameData.playerData.splice(i, 1);
    }
  })

  beerDrinkers.forEach(chronicDrinker => {
    let tempBeerState;
    if(chronicDrinker.beer == "ready") {
      tempBeerState = false;
      beerChanges.push({newBeerState: tempBeerState, player: chronicDrinker});
    }
    
    if (chronicDrinker.health <= 0){
      roundSummary.push(MakeStartedBeerMsg(chronicDrinker.pId))
    }
    else{
      chronicDrinker.health += 1;
      roundSummary.push(MakeFinishedBeerMsg(chronicDrinker.pId))
    }
    

    console.log(chronicDrinker)
  })

  beerChanges.forEach(beerChange => {
    beerChange.player.beer = beerChange.newBeerState;
  })

  return roundSummary;
}

let timeoutId

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

    player.ws.send(JSON.stringify(MakeChooseMsg(playerData.options)));
  })

  console.log(room.gameData.state)

  timeoutId = setTimeout(() => gatherEvent(room), CHOOSE_TIME);
}

const gatherEvent = (room) => {
  room.gameData.state = "gathering"; //gathering tells clients that they should not call any more choose calls, it's a delay for previous ones to finish
  console.log(room.gameData.state)

  sendToAllInRoom(room, JSON.stringify(MakeStopChoiceMsg()));

  setTimeout(() => processEvent(room), GATHER_TIME);
}

const processEvent = (room) => {
  room.gameData.state = "processing";

  console.log(room.gameData.state)
  console.log(room.gameData.playerData)
  
  sendToAllInRoom(room, JSON.stringify(MakeProcessingMsg()));

  const roundSummary = processChoices(room);

  sendToAllInRoom(room, JSON.stringify(MakeRoundActionsMsg(roundSummary)));

  if (room.gameData.playerData.length <= 1){
    console.log("game is over")
    const winner = room.gameData.playerData[0];
    room.state = "game-over";

    sendToAllInRoom(room, JSON.stringify(MakeGameOverMsg(winner && winner.pId)));
    
    console.log(room)
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
  room.gameData.playerData.filter(data => console.log(data));

  if (room.gameData.playerData.filter(data => data.choice.type === undefined).length === 0){

    if(timeoutId !== undefined)
      gatherEvent(room);
    clearTimeout(timeoutId);
    timeoutId = undefined;
  }
}