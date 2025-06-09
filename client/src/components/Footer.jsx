import "../style/footer.css";
import { Row, Col } from "react-bootstrap";

function Footer(){
    return(
        <footer className="container-fluid footer">
            <Row>
                <Col className="mb-2" as='p'>
                    &copy; 2025 Esame Applicazioni Web I
                </Col>
            </Row>
        </footer>
    );
}

export default Footer;