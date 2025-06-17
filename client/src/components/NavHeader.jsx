import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import { Link } from "react-router";
import logo from "/assets/logoNavbar.jpg"
import "../style/navbar.css"

function NavHeader(props) {

  return(
    <Navbar bg='info' expand='lg'>
      <Container fluid>
        <Link to="/" className="navbar-brand">
          <Image src={logo} alt="Logo" roundedCircle width="30" height="30"
              className="d-inline-block align-text-top"
              style={{ marginRight: '0.5rem' }}/>
          Gioco della Sfortuna
        </Link>
        <Navbar.Toggle aria-controls="navbarNavAltMarkup" />
        <Navbar.Collapse id="navbarNavAltMarkup">
          <Nav className="ms-auto navbar-nav">
            {props.loggedIn ?
              <NavDropdown title={`${props.userInfo.name} ${props.userInfo.surname}`} align="end">
                <NavDropdown.Item disabled>
                  {props.userInfo.username}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/">
                  Home <i className="bi bi-house-door ms-2"></i>
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/cronologia">
                  Pagina profilo <i className="bi bi-person ms-2"></i>
                </NavDropdown.Item>
                <NavDropdown.Item className="text-danger" onClick={props.handleLogout}>
                  Esci <i className="bi bi-door-open ms-2"></i>
                </NavDropdown.Item>
              </NavDropdown> :
              <Link to="/" className="nav-link active" aria-current="page">
                Home
              </Link>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavHeader;