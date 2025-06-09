import { Container, Row, Col, Alert } from "react-bootstrap";
import { Outlet } from "react-router";
import NavHeader from "./NavHeader";
import Footer from "./Footer";

function DefaultLayout(props) {
  
  return(
    <>
      <NavHeader loggedIn={props.loggedIn} handleLogout={props.handleLogout} userInfo={props.userInfo} />
      <Container fluid className="mt-3">
        {props.message &&
          <Row>
            <Col>
              <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
            </Col>
          </Row>}
        <Outlet />
      </Container>
      <Footer />
    </>
  );
}

export default DefaultLayout;