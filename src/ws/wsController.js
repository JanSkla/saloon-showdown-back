import { WebSocketServer } from "ws";
import { createRoomService, joinRoomService } from "./wsService.js";
import { joinRoomValidateData } from "../validations/wsValidations.js";

const wss = new WebSocketServer({port: 8080});

const startWs = () => {
  wss.on('connection', function connection(ws) {
    
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

      switch (data.type){
        case "create-room":
          createRoomService(ws);
          break;
          
        case "join-room":
          if(!joinRoomValidateData(data)) ws.close();
          else {
            console.log("aaa")
            joinRoomService(ws, data.code);
          }
          break;

        default:
          ws.close();
          break;
      }
    });
  });
}

export default startWs;