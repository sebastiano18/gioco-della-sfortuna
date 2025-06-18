import { Card } from "../models/gsModels.mjs";


const SERVER_URL = "http://localhost:3001";

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',       //non gli stiamo mandando nessun cookie, ma dobbiamo far funzionare tutti i credientials include successivi così
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok){
    return null;
  }
  else{
    throw new Error("500 Internal server error");
  }
}

const getDeckCards = async () => {
  const response = await fetch(SERVER_URL + "/api/partita/deckCards");

  if(response.ok){
    const deckCardsJson = await response.json();
    const deckCards = deckCardsJson.map( c => new Card(c.idCarta, c.nome, c.immagine, c.indice) );  //cardsJSON è un array di oggetti json
    return deckCards.sort((a, b) => a.indice - b.indice);
  }
  else{
    throw new Error("500 Internal server error");
  }
}

const getUnknownIndexCards = async (excludedCardIds, nOfCards) => {
  const response = await fetch(SERVER_URL + "/api/partita/unknownIndexCards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ excludedCardIds, nOfCards })
  });

  if(response.ok){
    const unknownCardsJson = await response.json();
    const unknownCards = unknownCardsJson.map( c => new Card(c.idCarta, c.nome, c.immagine, c.indice) );  //cardsJSON è un array di oggetti json
    return unknownCards;
  }
  else{
    throw new Error("500 Internal server error");
  }
}

const getUnknownCardIndex = async (unknownCardId) => {
  const response = await fetch(SERVER_URL + '/api/partita/unknownCardIndex', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ unknownCardId })
  });

  if(response.ok){
    const unknownCardIndexJson = await response.json();
    return unknownCardIndexJson.indice;
  }
  else{
    throw new Error("500 Internal server error");
  }
}

const addMatch = async (match) => {
  console.log("ciaooooooooooooooooooooo", match);
  const response = await fetch(SERVER_URL + '/api/partita/addMatch', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ match }),
    credentials: 'include'
  });

  if(response.ok){
    return null;
  }
  else{
    throw new Error("500 Internal server error");
  }
}

const getOrderedUserHistoryData = async (idUtente) => {
  const response = await fetch(SERVER_URL + `/api/paginaProfilo/${idUtente}`, {
    credentials: 'include',
  });

  if(response.ok){
    const userHistoryDataOrderedByDate = await response.json();
    return userHistoryDataOrderedByDate;
  }
  else{
    throw new Error("500 Internal server error");
  }
}


const API = { logIn, logOut, getUserInfo, getDeckCards, getUnknownIndexCards, getUnknownCardIndex, addMatch, getOrderedUserHistoryData };
export default API;