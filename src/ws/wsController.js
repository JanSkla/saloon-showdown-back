import { WebSocketServer } from "ws";
import { createRoomService, joinRoomService, startGameService } from "./wsService.js";
import { chooseCardValidateData, joinRoomValidateData } from "../validations/wsValidations.js";
import { removePlayer, rooms } from "../utils/roomsData.js";
import { handlePlayerChoice } from "../utils/game.js";

const wss = new WebSocketServer({port: 8080});

const startWs = () => {
  wss.on('connection', function connection(ws) {
    
    let room;
    let player;

    ws.on('message', (data) => {

      try {
        data = JSON.parse(data);
      } catch (e) {
        console.log(e)
        ws.close();
        return false;
      }

      console.log(data)

      if(!data.type) { ws.close(); return; };

      if(!room){
        switch (data.type){
          case "create-room":
            const joinData = createRoomService(ws);
            room = joinData.room;
            player = joinData.player;
            break;
            
          case "join-room":
            if(joinRoomValidateData(data)){
              const joinData = joinRoomService(ws, data.code);
              room = joinData.room;
              player = joinData.player;
              break;
            }
  
          default:
            ws.close();
            break;
        }
        ws.on('close', () => {
          console.log('closed');
          if(room && player){
            const roomIndex = rooms.indexOf(room);
            removePlayer(roomIndex, rooms[roomIndex].players.indexOf(player));
          }
        });

      } else if (room.state == "lobby") {
        console.log("has a room")
        switch (data.type){
          case "start-game":
            if(room.leadPlayer == player){
              startGameService(room);
            }
            break;
        default:
          ws.close();
          break;
      }
      } else if (room.state == "game") {
        
        switch (data.type){
          case "choose-card":
            switch (room.gameData.state){
              case "choose":
              case "gathering":
                if (chooseCardValidateData(data)) {
                  handlePlayerChoice(room, player, data);
                  break;
                }
            default:
              ws.close();
              break;
            }
            break;
        default:
          ws.close();
          break;
        }
      }
      else {
        ws.close();
      }
    });
  });
}

export default startWs;