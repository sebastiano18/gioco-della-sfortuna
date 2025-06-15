import express from 'express';
import morgan from 'morgan';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import { getUser, getDeckCards, getUnknownIndexCards, getUnknownCardIndex, addNewMatch, addNewRound } from './dao.mjs';

import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

// init express
const app = new express();
const port = 3001;

//middleware
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await getUser(username, password);
  if(!user){
    return callback(null, false, 'Credenziali non valide.');
  }
  return callback(null, user);
}));

passport.serializeUser(function (user, callback) {//prende i dati dell'utente, presi dal db, e li serializza per salvare le info della sessione
  callback(null, user);
});

passport.deserializeUser(function (user, callback) {//spacchetta il cookie arrivato dal browser
  return callback(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authenticated'});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

// POST /api/sessions
app.post('/api/sessions', passport.authenticate('local'), function(req, res) {
  return res.status(201).json(req.user); //restituiamo le infos dell'utente
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});



// per prendere le immagini delle carte salvate sul server:
app.use(express.static('public'));

// GET deck cards, at the beginning of a match
app.get('/api/partita/deckCards', async (req, res) => {
  try {
    const deckCards = await getDeckCards();
    res.json(deckCards);
  } catch (err) {
    console.error('Error getting deck cards:', err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// POST 1 or 5 unknown index cards, at the beginning of a match
app.post('/api/partita/unknownIndexCards', async (req, res) => {
  try {
    const { excludedCardIds, nOfCards } = req.body;
    const unknownIndexCards = await getUnknownIndexCards(excludedCardIds, nOfCards);
    res.json(unknownIndexCards);
  } catch (err) {
    console.error('Error getting unknown cards:', err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.post('/api/partita/unknownCardIndex', async (req, res) => {
  try {
    const { unknownCardId } = req.body;
    const unknownCardIndex = await getUnknownCardIndex(unknownCardId);
    res.json(unknownCardIndex);
  } catch (err) {
    console.error('Error getting unknown card index:', err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.post('/api/partita/addMatch', async (req, res) => {
  try{
    const match = req.body;
    const idPartita = await addNewMatch(match);
    console.log(match.round)
    await addNewRound(idPartita, match.round);

    res.status(201).end();
  } catch(err){
    res.status(500).json({error: 'Internal Server Error'});
  }
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});