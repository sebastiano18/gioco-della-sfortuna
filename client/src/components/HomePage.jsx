import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

function HomePage(props){
    return(
        <>
            <Row>
                <Col className="mt-3 text-center">
                    <h3>Descrizione del gioco:</h3>
                </Col>
            </Row>
            <Row>
                <Col md={10} className="mt-3 mx-auto" as='p'>
                    In questo gioco sfiderai il computer per raccogliere 6 carte ognuna con una situazione orribile diversa, ma riguardante sempre la vita universitaria.
                    Ogni carta ha un'immagine, un nome ed un “indice di sfortuna” da 1 a 100 (più alto = più terribile).
                    Ma c'è un trucco: dovrai indovinare quanto è grave la nuova situazione, confrontandola con quelle che hai già in mano!
                    All'inizio riceverai 3 carte casuali dal computer e, ad ogni round, ti verrà mostrata una nuova situazione (senza sapere il suo indice di sfortuna).
                    Guardando le tue carte, ordinate per gravità crescente, dovrai decidere in che ordine si colloca la nuova situazione tra quelle che possiedi.
                    Se indovini, la vinci e si aggiungerà alla tua collezione; ma se sbagli, la perdi e non potrai più recuperarla.
                    L'obiettivo è semplice: raccogliere 6 carte prima di commettere 3 errori.
                    Accedendo potrai giocare partite complete, salvare i tuoi progressi e consultare la cronologia delle partite giocate.
                    Se vuoi continuare, senza effettuare l'accesso, puoi provare una demo rapida, ma di un solo round per scoprire come funziona il gioco.
                    Che aspetti? Buon divertimento!
                </Col>
            </Row>
            {props.loggedIn ?
                <Row>
                    <Col md={2} className="mt-5 mx-auto text-center">
                        <Link className="btn btn-primary btn-lg" to="/partita">Avvia Partita</Link>
                    </Col>
                </Row>
            :
            <>
                <Row>
                    <Col md={2} className="mt-5 mx-auto text-center">
                        <Link className="btn btn-primary" to="/login">Accedi</Link>
                    </Col>
                </Row>
                <Row>
                    <Col md={2} className="mt-1 mb-1 mx-auto text-center" as='p'>
                        oppure
                    </Col>
                </Row>
                <Row>
                    <Col md={3} className="mt-1 mx-auto text-center">
                        <Link className="btn btn-primary" to="/partita">Continua senza accedere</Link>
                    </Col>
                </Row>
            </>
            }
        </>
    );
}

export default HomePage;