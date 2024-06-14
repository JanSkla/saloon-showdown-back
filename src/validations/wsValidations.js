export const joinRoomValidateData = (data) => {
  return !!data.code;
}

export const chooseCardValidateData = (data) => {
  
  if (!data.choice) return false;

  switch (data.choice) {
    case "ammo":
    case "block":
    case "beer":
      return true;
    case "shoot":
      return !!data.target;
    default:
      return false;
  }
}
