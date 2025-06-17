import {Row, Col} from "react-bootstrap";
import API from "../API/API.mjs";
import { useState } from "react";
import React, { useEffect } from "react";
import "../style/userPage.css";

function UserPage(props){

    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
    const getHistoryData = async () => {
        console.log(props.user.id)
        const orderedHistoryDataArray = await API.getOrderedUserHistoryData(props.user.id);
        
        console.log(orderedHistoryDataArray);
        setHistoryData(orderedHistoryDataArray);
    }

    getHistoryData();
    }, []);



    return(
        <>
        <Row>
            <Col>
                <h2>{`${props.user.name} ${props.user.surname}`}</h2>
            </Col>
        </Row>
        <Row className="justify-content-center">
            <Col md={6} className="text-center">
                <h3>Partite completate:</h3>
            </Col>
        </Row>

        <Row className="justify-content-center">
            <Col md={10} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {
                    historyData.map((partita) => (
                        <React.Fragment key={partita.idPartita}>
                            <Row className="mb-2" id="sfondo-record-partita">
                                <Col md={2} id="singola-colonna">
                                    {partita.esito ? (
                                        <p><strong>Vinta:</strong> {`${partita.nCarteRaccolte}`} carte raccolte</p>
                                    ) : (<p><strong>Persa:</strong> {`${partita.nCarteRaccolte}`} carte raccolte</p>
                                    )}
                                    <p>giocata il: {partita.data}</p>
                                </Col>
                                <Col className="text-center" id="singola-colonna" md={4}>
                                    <p>Nomi carte iniziali:</p>
                                    {partita.carteIniziali.map( (cartaIniziale, indx) => (
                                        <p key={indx}>{cartaIniziale.nome}</p>
                                    ))}
                                </Col>
                                <Col className="text-center" id="singola-colonna" md={6}>
                                    <p>Nomi carte apparse nei round:</p>
                                    {partita.carteRound.map((cartaRound, indx) => (
                                        <p key={indx}>
                                            {cartaRound.nome}
                                            {
                                                cartaRound.conquistata ? (
                                                  <span> conquistata al round {cartaRound.nRound}</span>
                                                ) : (
                                                  <span> persa al round {cartaRound.nRound}</span>
                                                )
                                            }
                                        </p>
                                    ))}
                                </Col>
                            </Row>
                        </React.Fragment>
                    ))
                }
            </Col>
        </Row>
        </>
    );
}

export default UserPage;