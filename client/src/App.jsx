import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router";
import DefaultLayout from "./components/DefaultLayout";
import HomePage from "./components/HomePage";
import { useState, useEffect } from "react";
import { LoginForm } from "./components/LoginForm";
import API from "./API/API.mjs";
import NotLoggedMatch from "./components/NotLoggedMatch";
import MatchSummary from "./components/MatchSummary";
import LoggedMatch from "./components/LoggedMatch";
import UserPage from "./components/UserPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

  const [match, setMatch] = useState({ idUtente: null, data: null, nCarteRaccolte: null, esito: null, idsCarteIniziali: [], round: [] });
  const [nRound, setnRound] = useState(1);

  useEffect(() => { //All'avvio dell'app
    const checkAuth = async () => {
      try{
        const user = await API.getUserInfo();  
        setLoggedIn(true);
        setUser(user);
      }catch(e){
        setLoggedIn(false);
        setUser({});
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Benvenuto ${user.name}!`, type: 'success'});
      setUser(user);
      setTimeout(() => setMessage(''), 4000); // message disappears after 4 seconds
    } catch(err) {
      
      setMessage({msg: err, type: 'danger'});
      setTimeout(() => setMessage(''), 4000); // error message disappears after 4 seconds
    }
  }

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage('');
  };
  
  const [deckCards, setDeckCards] = useState([]);
  const [unknownIndexCards, setUnknownIndexCards] = useState([]);
  

  return (
    <Routes>
      <Route element={ <DefaultLayout message={message} setMessage={setMessage} handleLogout={handleLogout} loggedIn={loggedIn} userInfo={user} /> } >
        <Route path="/" element={ <HomePage loggedIn={loggedIn} /> }/>
        <Route path="/login" element={ loggedIn ? <Navigate replace to='/' /> : <LoginForm handleLogin={handleLogin} /> } />
        
        {loggedIn ? (
          <>
          <Route path="/partita" element={<LoggedMatch timerDuration={30} loggedIn={loggedIn} deckCards={deckCards}
          setDeckCards={setDeckCards} match={match} setMatch={setMatch} nRound={nRound} setnRound={setnRound} user={user} 
          unknownIndexCards={unknownIndexCards} setUnknownIndexCards={setUnknownIndexCards} />} />

          <Route path="/paginaProfilo" element={loggedIn && <UserPage user={user} />} />
          </>
        ) : (
          <Route path="/partita" element={<NotLoggedMatch timerDuration={30} deckCards={deckCards} setDeckCards={setDeckCards} />} />
        )}

        <Route path="/partita/riepilogo" element={<MatchSummary deckCards={deckCards} setMatch={setMatch} />} />
      </Route>
    </Routes>
  )
}

export default App;