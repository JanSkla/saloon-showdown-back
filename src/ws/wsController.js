import { WebSocketServer } from "ws";
import { createRoomService, joinRoomService } from "./wsService.js";
import { joinRoomValidateData } from "../validations/wsValidations.js";
import { removePlayer, rooms } from "../utils/roomsData.js";

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

      if(!room || !player){
        switch (data.type){
          case "create-room":
            const joinData = createRoomService(ws);
            room = joinData.room;
            player = joinData.player;
            break;
            
          case "join-room":
            if(!joinRoomValidateData(data)) ws.close();
            else {
              const joinData = joinRoomService(ws, data.code);
              room = joinData.room;
              player = joinData.player;
            }
            break;
  
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

      } else {
        console.log("has a room")
        switch (data.type){
          case "start-game":
            
            break;
        default:
          ws.close();
          break;
      }
      }
    });
  });
}

export default startWs;