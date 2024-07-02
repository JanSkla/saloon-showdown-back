export const joinRoomValidateData = (data) => {
  return !!data.code;
}

export const chooseCardValidateData = (data) => {
  
  if (!data.choice) return false;

  switch (data.choice) {
    case "ammo":
    case "block":
    case "order-beer":
    case "drink-beer":
      return true;
    case "shoot":
      return data.target !== undefined;
    default:
      return false;
  }
}
