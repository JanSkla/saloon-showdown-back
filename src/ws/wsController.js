import { WebSocketServer } from "ws";
import { createRoom, joinRoom } from "./wsService.js";
import { joinRoomValidateData } from "../validations/wsValidations";

const wss = new WebSocketServer({port: 8080});

const players = [];

const startWs = () => {
  wss.on('connection', function connection(ws) {
    const index = players.push(ws);
    
    ws.on('message', (data) => {
      data = JSON.parse(data);

      console.log(data)

      if(!data.type) { ws.close(); return; };

      switch (data.type){
        case "create-room":
          createRoom(ws);
          break;
          
        case "join-room":
          if(!joinRoomValidateData(data)) ws.close();
          else {
            console.log("aaa")
            joinRoom(ws, data.code);
          }
          break;

        default:
          ws.close();
          break;
      }
    });
    ws.on('close', () => {
      console.log('closed');
      players.splice(index - 1, 1);
      console.log(players)
    });
  });
}

export default startWs;