export const joinRoomValidateData = (data) => {
  return !!data.code;
}

export const chooseCardValidateData = (data) => {
  
  if (!data.choice) return false;

  switch (data.choice) {
    case "ammo":
    case "shoot":
      if(!data.target) return false;
    case "block":
    case "beer":
      return true;
    default:
      return false;
  }
}
