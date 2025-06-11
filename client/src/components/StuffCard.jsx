import { Row, Col, Image } from "react-bootstrap";
import "../style/stuffCard.css"

function StuffCard(props){
    return(
        <Row>
            <Col id="sfondo-carta">
                <Row>
                    <Col md={7} className="mt-2 mx-auto">
                        <Image id="sfondo-img" src={`http://localhost:3001/${props.image}`} thumbnail />
                    </Col>
                </Row>

                <Row>
                    <Col as="p" className="mb-1 text-center">
                        Indice: {props.index ? `${props.index}` : `?`}
                    </Col>
                </Row>

                <Row>
                    <Col md={9} as="p" className="mx-auto text-center" id="sfondo-testo">
                        {`${props.text}`}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default StuffCard;