import express from 'express';
import morgan from 'morgan';
import { check, validationResult, param } from 'express-validator';
import cors from 'cors';
import { getUser, getDeckCards, getUnknownIndexCards, getUnknownCardIndex, addNewMatch, addNewRound, getUserHistoryDataDB, addCarteIniziali } from './dao.mjs';
import dayjs from 'dayjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { groupAndOrderPartite } from './utils/utils.mjs';

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

// DELETE /api/sessions/current
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
app.post('/api/partita/unknownIndexCards', [
  check('excludedCardIds').exists().isArray(),
  check('nOfCards').exists().isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }

  try {
    const { excludedCardIds, nOfCards } = req.body;
    const unknownIndexCards = await getUnknownIndexCards(excludedCardIds, nOfCards);
    res.json(unknownIndexCards);
  } catch (err) {
    console.error('Error getting unknown cards:', err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.post('/api/partita/unknownCardIndex', [
  check('unknownCardId').exists().isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }

  try {
    const { unknownCardId } = req.body;
    const unknownCardIndex = await getUnknownCardIndex(unknownCardId);
    res.json(unknownCardIndex);
  } catch (err) {
    console.error('Error getting unknown card index:', err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.post('/api/partita/addMatch', isLoggedIn, [
  check('match').exists().isObject(),
  check('match.idUtente').exists().isNumeric(),
  check('match.data').exists().custom(value => dayjs(value, 'YYYY-MM-DD HH:mm:ss', true).isValid()),
  check('match.nCarteRaccolte').exists().isNumeric(),
  check('match.esito').exists().isNumeric(),
  check('match.idsCarteIniziali').exists().isArray(),
  check('match.round').exists().isArray()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }

  try{
    const match = req.body.match;
    const idPartita = await addNewMatch(match);
    await addCarteIniziali(idPartita, match.idsCarteIniziali);
    await addNewRound(idPartita, match.round);

    res.status(201).end();
  } catch(err){
    console.error('Error adding a match:', err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.get('/api/paginaProfilo/:idUtente', isLoggedIn,
  param('idUtente').isNumeric(), async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }
  
  try{
    const idUtente = req.params.idUtente;
    const userHistoryDataArray = await getUserHistoryDataDB(idUtente); 
    const orderedUserHistoryDataArray = groupAndOrderPartite(userHistoryDataArray);
    
    res.json(orderedUserHistoryDataArray);
  } catch(err){
    res.status(500).json({error: 'Internal Server Error'});
  }
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});