export const makeRandomString = (length)  => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const sendToAllInRoom = (room, value) => {
  room.players.forEach(player => {
    
    player.ws.send(value);
  });
}

export const getPlayerByPIdAndRoom = (room, pId) => {
  return room.players.find(player => player.pId == pId);
}


export const getRandomName = () => {

  const names = ["Duckster", "Lucky_Ducke", "The_Duckton_Brother", "Old_Shatterduck"]

  const random = Math.floor(Math.random() * names.length);

  return names[random];
}