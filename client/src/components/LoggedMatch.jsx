import React, { useEffect } from "react";
import StuffCard from "./StuffCard";
import {Row, Col, Card} from "react-bootstrap";
import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDraggable, useDroppable } from "@dnd-kit/core";
import API from "../API/API.mjs";
import AfterEachRoundModal from "./AfterEachRoundModal";
import { checkIfGuessed } from "../utils/utils.mjs";
import { Match } from "../models/gsModels.mjs";
import dayjs from "dayjs";



function DraggableCard({ idCarta, nome, immagine }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: idCarta });
    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
            cursor: isDragging ? "grabbing" : "grab",
            opacity: isDragging ? 0.5 : 1,
            }}
        >
        <StuffCard image={immagine} text={nome}/>
        </div>
    );
}

function DropZone({ id }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <Card
            ref={setNodeRef}
            id={id}
            style={{
            width: 120,
            height: 140,
            background: isOver ? "#cfc" : "#eee",
            border: "1px dashed #aaa",
            // + inside
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            color: "#aaa",
            }}
        > +
        </Card>
    );
}

function LoggedMatch(props){
    //stati per la gestione del timer
    const [time, setTime] = useState(props.timerDuration);
    const [timerStatus, setTimerStatus] = useState(true);
    const [timeOut, setTimeOut] = useState(false);


    useEffect(() => {
    if(timerStatus){
        if (time <= 0){
            setTimeOut(true);
            setTimerStatus(false);
        }
        else{
            const timerId = setTimeout(() => {
            setTime(time - 1);
            }, 1000);
            return () => clearTimeout(timerId);   //pulisce il timer precedente
        }
    }
    }, [time]);

    //se il giocatore non dovesse fare alcuna scelta nei 30s
    useEffect(() => {
    if(timeOut){
        handleRoundEnd(false);
    }
    }, [timeOut]);


    //stati per la gestione del match
    const [actualRound, setActualRound] = useState({idCarta: null, nRound: null, conquistata: null});
    const { deckCards, setDeckCards } = props;
    const [draggableCard, setDraggableCard] = useState([]);
    const [ultimoRound, setUltimoRound] = useState(false);
    const [vite, setVite] = useState(3);



    //stato per il modal di fine round
    const [show, setShow] = useState(false);


    const handleRoundEnd = (correct) => {
        setTimerStatus(false);

        if(!correct){
            setVite(vitaPrec => vitaPrec - 1);
        }

        const updatedRound = { ...actualRound, conquistata: correct };  //costruisce l'obj per evitare errori dovuti al comportamento asincrono degli stati
        setActualRound(updatedRound);
        props.setMatch(matchPrec => ({...matchPrec, round: [...matchPrec.round, updatedRound]}));
        if(deckCards.length === 6){
            setUltimoRound(true);
        }
        setShow(true); 
    };

    const handleNextRoundAtModalClosure = () => {
        if(vite === 0){
            const esito = 0;
            props.setnRound(1);
            const match = new Match(props.user.id, dayjs().format('YYYY-MM-DD HH:mm:ss'), deckCards.length, esito, props.match.idsCarteIniziali, props.match.round);
            API.addMatch(match);    
        }
        else if(deckCards.length < 6 && props.nRound < 5){
            props.setnRound(props.nRound + 1);
            setTimerStatus(true);
            setTime(30);
        }
        else{  //in caso di vittoria
            const esito = deckCards.length === 6 ? 1 : 0;
            props.setnRound(1);
            setUltimoRound(false);
            const match = new Match(props.user.id, dayjs().format('YYYY-MM-DD HH:mm:ss'), deckCards.length, esito, props.match.idsCarteIniziali, props.match.round);
            API.addMatch(match);
        }
        setTimeOut(false)
        setShow(false)
    }

    //all'inizio del primo round
    useEffect(() => {
    const fetchCards = async () => {
        const deckCards = await API.getDeckCards();
        setDeckCards(deckCards);
        props.setMatch(matchPrec => ({...matchPrec, idUtente: props.user.id, idsCarteIniziali: deckCards.map(c => c.idCarta)}))   //aggiungi gli ids delle carte iniziali di quella partita

        const unknownIndexCardArray = await API.getUnknownIndexCards(deckCards.map(c => c.idCarta), 5);
        props.setUnknownIndexCards(unknownIndexCardArray);  //perché non voglio perdere l'array tra un round e l'altro
        

        setActualRound(prec => ({...prec, idCarta: unknownIndexCardArray[props.nRound - 1].idCarta, nRound: props.nRound}));
        setDraggableCard(unknownIndexCardArray[props.nRound - 1]);
    }

    fetchCards();
    }, []);

    useEffect(() => {
        const card = props.unknownIndexCards[props.nRound - 1];
        if (card) {
            setActualRound(prec => ({ ...prec, idCarta: card.idCarta, nRound: props.nRound }));
            setDraggableCard(card);
        }
    }, [props.nRound]);  //props.unknownIndexCards inutile


    useEffect(() => {
        if (deckCards.length === 6 || vite === 0) {
            setUltimoRound(true);
        } else {
            setUltimoRound(false);
        }
    }, [deckCards.length, vite]);
    
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (draggableCard && active.id === draggableCard.idCarta && over && over.id.startsWith("dropzone-")) {
        const insertIndex = parseInt(over.id.replace("dropzone-", ""), 10);
        const newCards = [...deckCards];
        newCards.splice(insertIndex, 0, draggableCard);


        const unknownCardIndex = await API.getUnknownCardIndex(actualRound.idCarta);

        const correct = checkIfGuessed(draggableCard.idCarta, unknownCardIndex, newCards);
        if(correct){
            newCards[insertIndex].indice = unknownCardIndex;  //solo se la carta viene vinta mostra il suo indice nel riepilogo della partita
            setDeckCards(newCards);
            setDraggableCard(null);
        }
        handleRoundEnd(correct);
        

    }
    };

    return(
    <>
    <Row>
        <Col md={5} as='strong' style={{ color: "red" }}>
            Vite rimaste: {`${vite}`}
        </Col>
        <Col as='strong' style={{ color: "red" }} className="ms-5">
            Tempo restante: {`${time}`}s
        </Col>
    </Row>

    <Row>
        <Col>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>

            {/*carte nel mazzo del giocatore */}
            <Row className="flex-nowrap justify-content-between align-items-stretch" style={{ overflowX: "auto" }}>
            {deckCards.map((card, idx) => (
                <React.Fragment key={card.idCarta}>
                <Col md={2} className="d-flex justify-content-center align-items-center">
                    <DropZone id={`dropzone-${idx}`} />
                </Col>
                <Col md={2} className="d-flex justify-content-center">
                    <StuffCard image={card.immagine} text={card.nome} index={card.indice} />
                </Col>
                </React.Fragment>
            ))}
            <Col md={2} className="d-flex justify-content-center align-items-center">
                <DropZone id={`dropzone-${deckCards.length}`} />
            </Col>
            </Row>
            

            <Row className="mt-3">           {/*carta che deve essere inserita */}
            <Col md={2} className="mx-auto text-center">
                <strong>Carta da inserire:</strong>
                {draggableCard && <DraggableCard {...draggableCard} />}
            </Col>
            </Row>

        </DndContext>
        </Col>
    </Row>
    <AfterEachRoundModal correct={actualRound.conquistata} show={show} onHide={() => handleNextRoundAtModalClosure()} timeOut={timeOut} ultimoRound={ultimoRound} />
    </>
    );
}

export default LoggedMatch;