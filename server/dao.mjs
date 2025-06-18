import sqlite from 'sqlite3';
import crypto from 'crypto';
import { Card } from '../client/src/models/gsModels.mjs';
import { resolve } from 'path';



// open the database
const db = new sqlite.Database('./AW_DB.db', (err) => {
  if (err){
    throw err;
  }
});

export const getUser = (email, password) => { //password che ci arriva dalla richiesta
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM UTENTE WHERE email = ?";
        db.get(sql, [email], (err, row) => {
            if (err) { 
                reject(err); 
            }
            else if (row === undefined) { //l'utente non è stato trovato, username che non esiste
                resolve(false); //è sempre andato a buon fine, se ne occuperà index.mjs a lanciare il messaggio di credenziali non valide
            }
            else {
                const user = {id: row.idUtente, username: row.email, name: row.nome, surname: row.cognome}; //mi salvo l'utente che sto cercando
                
                crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) { //funzione di callback e il risultato dell'operazione lo chiamiamo hashedPassword
                    if (err){
                        reject(err);
                    }
                    if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)){
                        resolve(false);
                    }
                    else{
                        resolve(user);
                    }
                });
            }
        });
    });
}

export const getDeckCards = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT idCarta, nome, immagine, indice
                    FROM CARTA
                    ORDER BY RANDOM()
                    LIMIT 3`;
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                const cards = rows.map(row => ({
                    idCarta: row.idCarta,
                    nome: row.nome,
                    immagine: row.immagine,
                    indice: row.indice
                }));
                resolve(cards);
            }
        });
    });
}

export const getUnknownIndexCards = (threeDeckCards, nOfCards) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT idCarta, nome, immagine
                    FROM CARTA
                    WHERE idCarta != ? AND idCarta != ? AND idCarta != ?
                    ORDER BY RANDOM()
                    LIMIT ?`;
        db.all(sql, [threeDeckCards[0], threeDeckCards[1], threeDeckCards[2], nOfCards], (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                const cards = rows.map(row => ({
                    idCarta: row.idCarta,
                    nome: row.nome,
                    immagine: row.immagine,
                    indice: undefined
                }));
                resolve(cards);
            }
        });
    });
}

export const getUnknownCardIndex = (unknownCardId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT indice
                    FROM CARTA
                    WHERE idCarta = ?`;
        db.get(sql, [unknownCardId], (err, row) => {
            if(err){
                reject(err);
            }
            else{
                resolve(row);
            }
        });
    });
}

export const addNewRound = (idPartita, rounds) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO ROUND (idPartita, idCarta, nRound, conquistata)
                    VALUES (?, ?, ?, ?)`;
        //se rounds è un array, inserisci tutti i round
        if (Array.isArray(rounds)) {
            const stmt = db.prepare(sql);
            for (const round of rounds) {
                stmt.run([idPartita, round.idCarta, round.nRound, round.conquistata], (err) => {
                    if (err) {
                        reject(err);
                    }
                });
            }
            stmt.finalize((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        } else {
            //caso singolo round
            db.run(sql, [idPartita, rounds.idCarta, rounds.nRound, rounds.conquistata], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        }
    });
}

export const addNewMatch = (match) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO PARTITA (idUtente, data, nCarteRaccolte, esito)
                    VALUES (?, ?, ?, ?)`;
        db.run(sql, [match.idUtente, match.data, match.nCarteRaccolte, match.esito], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

export const addCarteIniziali = (idPartita, idsCarteIniziali) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO ROUND (idPartita, idCarta)
                    VALUES (?, ?)`;
        
        const stmt = db.prepare(sql);
        for (const idCartaIniziale of idsCarteIniziali) {
            stmt.run([idPartita, idCartaIniziale], (err) => {
                if (err) {
                    reject(err);
                }
            });
        }
        stmt.finalize((err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

export const getUserHistoryDataDB = (idUtente) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT P.idPartita, P.data, P.nCarteRaccolte, P.esito,
                    C.nome,
                    R.nRound, R.conquistata
                    FROM PARTITA P
                    LEFT JOIN ROUND R ON P.idPartita = R.idPartita
                    LEFT JOIN CARTA C ON R.idCarta = C.idCarta
                    WHERE P.idUtente = ?`;
        db.all(sql, [idUtente], (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
    });
}

