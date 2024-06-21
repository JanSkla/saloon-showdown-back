
export const MakeRoundActionsMsg = (actions) => {
    return {
        type: "round-actions",
        data: actions   
    }
}

export const MakeRecievedBeerMsg = (userPID) => {
    return {
        type: "recieved-beer",
        user: userPID
    }
}

export const MakeAmmoMsg = (userPID) => {
    return {
        type: "ammo",
        user: userPID
    }
}

export const MakeShootDamageMsg = (userPID, targetPID) => {
    return {
        type: "shoot-damage",
        user: userPID,
        target: targetPID
    }
}

export const MakeShootDeathMsg = (userPID, targetPID) => {
    return {
        type: "shoot-death",
        user: userPID,
        target: targetPID
    }
}

export const MakeShootBlockMsg = (userPID, targetPID) => {
    return {
        type: "shoot-block",
        user: userPID,
        target: targetPID
    }
}

export const MakeShootBeerMsg = (userPID, targetPID) => {
    return {
        type: "shoot-beer",
        user: userPID,
        target: targetPID
    }
}

export const MakeBlockMsg = (userPID) => {
    return {
        type: "block",
        user: userPID
    }
}

export const MakeOrderBeerMsg = (userPID) => {
    return {
        type: "order-beer",
        user: userPID
    }
}

export const MakeStartedBeerMsg = (userPID) => {
    return {
        type: "started-beer",
        user: userPID
    }
}

export const MakeFinishedBeerMsg = (userPID) => {
    return {
        type: "finished-beer",
        user: userPID
    }
}

export const MakeGameOverMsg = (winnerPID) => {
    return {
        type: "game-over",
        winner: winnerPID
    }
}

// player and room related

export const MakePlayerJoinMsg = (joinPID) => {
    return {
        type: "player-join",
        player: joinPID
    }
}

export const MakePlayerDisconnectMsg = (disconnectPID) => {
    return {
        type: "player-disconnect",
        player: disconnectPID
    }
}

export const MakeNewLeaderMsg = (leaderPID) => {
    return {
        type: "new-leader",
        player: leaderPID
    }
}