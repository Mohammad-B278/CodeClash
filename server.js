/*
Used to set up websockets for the users, as well as process their messages
*/


import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const wss = new WebSocketServer({ port: process.env.WS_PORT || 8080 });

let activeMatches = new Map();
let queue = [];

wss.on('connection', (ws) => {
    console.log("New user connected");

    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        if (data.type === 'identify') { // To identify user during reconnection
            ws.userId = data.userID;
            ws.matchId = data.matchId; // Restoring match context
            console.log(`User ${data.userId} reconnected`);

            // Canceling the disconnection timeout if user reconnects on time
            if (ws.userId && activeMatches.has(ws.matchId)) {
                const match = activeMatches.get(ws.matchId);

                // Replacing the old WebSocket reference with the new one
                if (match.player1.userId === ws.userId) {
                    match.player1 = ws;  // Updating the player reference
                }
                else if (match.player2.userId === ws.userId) {
                    match.player2 = ws;
                }

                // Canceling the disconnection timeout if user reconnects on time
                if (match.disconnectTimers && match.disconnectTimers[ws.userId]) {
                    clearTimeout(match.disconnectTimers[ws.userId]);
                    delete match.disconnectTimers[ws.userId];
                    console.log(`User ${ws.userId} reconnected in time, match continues.`);
                }
            }
        }

        if (data.type === 'join_queue') { // Joining oponent search
            console.log(`User ${data.userId} joined queue`);
            ws.userId = data.userId;
            queue.push(ws);

            if (queue.length >= 2) { // If there are opponents available
                const player1 = queue.shift();
                const player2 = queue.shift();

                const challengeId = Math.floor(Math.random() * 10 + 1);
                const matchId = `match_${player1.userId}_${player2.userId}`;
                activeMatches.set(matchId, { player1, player2, disconnectTimers: {} });

                player1.send(JSON.stringify({ type: 'match_found', userId: player1.userId, opponent: player2.userId, challengeId, matchId })); // Notifying about match found
                player2.send(JSON.stringify({ type: 'match_found', userId: player2.userId, opponent: player1.userId, challengeId, matchId }));

                player1.matchId = matchId;
                player2.matchId = matchId;

                console.log(`Match found: ${player1.userId} vs ${player2.userId} (Challenge ${challengeId})`);
            }
        }

        if (data.type === 'problem_solved') {
            console.log(`User ${data.userId} solved the problem!`);
            
            const matchId = ws.matchId;
            if (!matchId || !activeMatches.has(matchId)) return;

            const match = activeMatches.get(matchId);

            if (match.winner) { // If problem was solved but winner is already decided
                console.log("Winner was already decided");
                return;
            }

            const winner = ws;
            const opponent = match.player1 === ws ? match.player2 : match.player1;

            // Recording the win
            match.winner = winner.userId;
            
            if (winner) {
                winner.send(JSON.stringify({ type: 'game_result', result: 'win' }));
            }
            if (opponent) {
                opponent.send(JSON.stringify({ type: 'game_result', result: 'lose' }));
            }

            activeMatches.delete(matchId);
        }
    });

    ws.on('close', async () => {
        console.log(`User ${ws.userId} disconnected`);

        queue = queue.filter(client => client !== ws);
        const matchId = ws.matchId;

        if (matchId && activeMatches.has(matchId)) { // If match is still active
            const match = activeMatches.get(matchId);
            const opponent = match.player1 === ws ? match.player2 : match.player1;

            if (!opponent || match.winner) return;
            console.log(`Waiting for ${ws.userId} to reconnect...`);

            match.disconnectTimers[ws.userId] = setTimeout(async () => { // Waiting for disconected user to return
                if (!activeMatches.has(matchId)) return;
                console.log(`User ${ws.userId} did not return, awarding win to opponent.`);
                
                if (!match.winner) {
                    if (ws.userId === match.player1.userId) {
                        match.player2.send(JSON.stringify({ type: 'game_result', result: 'win', opponent_disconnected: true })); // NOtifying about disconected user and sending results
                        match.winner = match.player2.userId;
                    } else {
                        match.player1.send(JSON.stringify({ type: 'game_result', result: 'win', opponent_disconnected: true }));
                        match.winner = match.player1.userId;
                    }
                    activeMatches.delete(matchId);
                }
            }, 10000);
        }
    });
});
