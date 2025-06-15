import { useActionState } from "react";
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router';

function LoginForm(props){
    const [state, formAction, isPending] = useActionState(loginFunction, {username: '', password: ''});

    async function loginFunction(prevState, formData) {
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            await props.handleLogin(credentials);
            return { success: true };
        } catch (error) {
            return { error: 'Login failed. Check your credentials.' };
        }
    }

    return(
        <>
            { isPending && <Alert variant="warning">Please, wait for the server's response...</Alert> }  {/*se il form è pensing*/}
            <Row className="mt-5 justify-content-center">
                <Col className="mt-4 py-5" md={4}>
                    <Form action={formAction}>
                        <Form.Group controlId='username' className='mb-3'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' name='username' required={true}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='password' className='mb-3'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' name='password' required={true} minLength={6}></Form.Control>
                        </Form.Group>

                        {state.error && <p className="text-danger">{state.error}</p>} {/** se l'utente non rispetta i vincoli*/}

                        <Form.Group className="mb-3 text-center">
                            <Button variant="primary" type='submit' disabled={isPending}>Accedi</Button>
                            {" "}
                            <Link className="btn btn-danger" to="/" disabled={isPending}>Indietro</Link>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

export { LoginForm };