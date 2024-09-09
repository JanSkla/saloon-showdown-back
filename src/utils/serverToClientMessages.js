import { CHOOSE_TIME, GATHER_TIME, PROCESS_TIME } from "../config.js"

export const MakeCreateRoomMsg = (roomCode, pId, players) => {
    return {
        type: "create-room",
        status: 200,
        code: roomCode,
        pId: pId,
        players: players
    }
}

export const MakeJoinRoomMsg = (code, pId, room) => {
    return {
        type: "join-room",
        status: 200,
        code: code,
        pId: pId,
        players: ParsePlayersDataForFrontEnd(room),
        radio: room.radio
    }
}

export const MakeErrorJoinRoomMsg = () => {
    return {
        type: "join-room",
        status: 400
    }
}
// player and room related

const ParsePlayerDataForFrontEnd = (player) => {
    return {
        pId: player.pId,
        name: player.name
    };
}

export const MakePlayerJoinMsg = (player) => {
    return {
        type: "player-join",
        player: ParsePlayerDataForFrontEnd(player)
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

export const ParsePlayersDataForFrontEnd = (room) => {

    const players = [];
    const leadPID = room.leadPlayer.pId

    room.players.forEach(player => {
        const pData = ParsePlayerDataForFrontEnd(player);

        pData.isLeadPlayer = leadPID == player.pId;
        players.push(pData);
    })

    return players;
}

// pre-game related
export const MakeLoadGameMessage = (room) => {
    return {
        type: "load-game",
        players: ParsePlayersDataForFrontEnd(room)
    }
}

export const MakeStartCountdownMessage = () => {
    return {
        type: "start-countdown",
        message: "Game starts in 3 seconds"
    }
}

export const MakeGameStartedMessage = () => {
    return {
        type: "game-started"
    }
}

export const MakePublicLobbiesMessage = (lobbies) => {
    return {
        type: "public-lobbies",
        lobbies: lobbies
    }
}

export const MakeLoadedDataMessage = (room) => {
    return {
        type: "loaded-data",
        players: ParsePlayersDataForFrontEnd(room)
    }
}

export const MakePlayerLoadedMessage = (loadedPID) => {
    return {
        type: "player-loaded",
        player: loadedPID
    }
}

export const MakePlayerReadyMessage = (readyPID) => {
    return {
        type: "player-ready",
        player: readyPID
    }
}

export const MakeRadioMessage = (radioState) => {
    return {
        type: "radio",
        state: radioState
    }
}



// game round related


export const MakeRoundActionsMsg = (actions) => {
    return {
        type: "round-actions",
        data: actions   //array
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

export const MakeShootDamageMsg = (userPID, targetPID, targetHealth) => {
    return {
        type: "shoot-damage",
        user: userPID,
        target: targetPID,
        targetHealth: targetHealth
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

export const MakeShootDrinkingBeerMsg = (userPID, targetPID) => {
    return {
        type: "shoot-drinking-beer",
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

export const MakeChooseMsg = (options) => {
    return {
        type: "choose",
        options: options,
        time: CHOOSE_TIME
    }
}

export const MakeStopChoiceMsg = () => {
    return {
        type: "stop-choice",
        time: GATHER_TIME,
    }
}

export const MakeProcessingMsg = () => {
    return {
        type: "processing",
        time: PROCESS_TIME,
    }
}