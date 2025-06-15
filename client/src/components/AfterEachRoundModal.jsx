import { Button, Modal} from 'react-bootstrap';
import { useNavigate } from 'react-router';

function AfterEachRoundModal(props) {
  const navigate = useNavigate();


  const nextRound = () => {
    props.onHide();
    navigate("/partita");
  }

  const endMatch = () => {
    props.onHide();
    navigate("/partita/riepilogo");
  }

  return (
    <Modal
    show={props.show}
    backdrop="static"
    keyboard={false}
    centered
    >
    <Modal.Header>
        <Modal.Title className="w-100 text-center">
        {props.timeOut ? (
          <span className="text-danger">Tempo scaduto! <i className="bi bi-hourglass-bottom"></i> </span>
        ) : (
          props.correct ? (
              props.ultimoRound ? (
                <span className="text-success">Hai vinto! <i className="bi bi-emoji-smile"></i> </span>
              ) : (
                <span className="text-success">Hai indovinato! <i className="bi bi-emoji-smile"></i> </span>
              )
          ) : (
              props.ultimoRound ? (
                <span className="text-danger">Hai perso <i className="bi bi-emoji-frown"></i> </span>
              ) : (
                <span className="text-danger">Non hai indovinato <i className="bi bi-emoji-frown"></i> </span>
              )
          )
        )}
        </Modal.Title>
    </Modal.Header>
    <Modal.Footer className="d-flex justify-content-center">
        {props.ultimoRound ?
          <Button className="btn-lg" variant="primary" onClick={endMatch}>Termina Partita</Button>
        :
          <Button className="btn-lg" variant="primary" onClick={nextRound}>Prossimo Round</Button>
        }
    </Modal.Footer>
    </Modal>
  );
}

export default AfterEachRoundModal;