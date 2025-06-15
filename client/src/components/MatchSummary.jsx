import React from "react";
import {Row, Col} from "react-bootstrap";
import StuffCard from "./StuffCard";
import { Link } from 'react-router';


function MatchSummary(props){
    console.log("deckCards:", props.deckCards);
    return(
        <>
        <Row className="mb-5 justify-content-center">
            <Col md={5} className="text-center">
                <h2>Riepilogo carte in tuo possesso:</h2>
            </Col>
        </Row>

        <Row className="flex-nowrap justify-content-between align-items-center" style={{ overflowX: "auto" }}>
            {props.deckCards.map(card => (
                <React.Fragment key={card.idCarta}>
                    <Col md={2} className="d-flex justify-content-center">
                        <StuffCard image={card.immagine} text={card.nome} index={card.indice} />
                    </Col>
                </React.Fragment>
            ))}
        </Row>

            <>
                <Row>
                    <Col md={2} className="mt-5 mx-auto text-center">
                        <Link className="btn btn-primary" to="/partita">Nuova Partita</Link>
                    </Col>
                </Row>
                <Row>
                    <Col md={2} className="mt-1 mb-1 mx-auto text-center" as='p'>
                        oppure
                    </Col>
                </Row>
                <Row>
                    <Col md={3} className="mt-1 mx-auto text-center">
                        <Link className="btn btn-primary" to="/">Fine</Link>
                    </Col>
                </Row>
            </>
        </>
    );
}

export default MatchSummary;