import { WebSocketServer } from "ws";
import { createRoomService, gameLoadedService, joinRoomService, startGameService } from "./wsService.js";
import { chooseCardValidateData, joinRoomValidateData } from "../validations/wsValidations.js";
import { removePlayer, rooms } from "../utils/roomsData.js";
import { handlePlayerChoice } from "../utils/game.js";

const wss = new WebSocketServer({port: 8080});

const startWs = () => {
  wss.on('connection', function connection(ws) {
    
    let room;
    let player;

    ws.on('message', (data) => {

      // one big try catch to make server not crash...
      try {
        console.log("recieved:" + data)

        data = JSON.parse(data);

        if(!data.type) { ws.close(); return; };

        if(!room){
          switch (data.type){
            case "create-room":
              const joinData = createRoomService(ws, data.name);
              room = joinData.room;
              player = joinData.player;
              break;
              
            case "join-room":
              if(joinRoomValidateData(data)){
                const joinData = joinRoomService(ws, data.name, data.code);

                if (!joinData){
                  console.log("bad join code attempt");
                  return;
                }

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
              removePlayer(room, player);
            }
          });

        } else if (room.state == "lobby" || room.state == "game-over") {
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
        } else if (room.state == "loading") {
          gameLoadedService(room, player);
        }
        else {
          ws.close();
        }
      } catch (e) {
        console.log(e)
        ws.close();
        return false;
      }
    });
  });
}

export default startWs;