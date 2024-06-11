import { makeRandomString } from "../utils/utils.js"

export const createRoom = ws => {
  ws.send(JSON.stringify({success: 200, data: makeRandomString(4)}))
}

export const joinRoom = (ws, code) => {
  ws.send(JSON.stringify({success: 200}))
}