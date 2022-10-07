import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../globals/user-data';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom';

export default function NavigationBar() {

    const { userState, setUserState } = useContext(UserContext)
    const [username, setUsername] = useState("")
    const navigate = useNavigate()



    useEffect(() => {
        setUsername(localStorage.getItem("name"))
    }, [])
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("name")
        localStorage.removeItem("_id")
        if (localStorage.getItem("isAdmin"))
            localStorage.removeItem("isAdmin")
        setUserState({ isAuth: false, token: null, isAdmin: false })
        toast.success('Logged out successfully')
        navigate('/')
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className='navgradient'>
            <Container>
                <Navbar.Brand href="#home">Topical Papers Generator</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav ">
                    <Nav className="me-auto d-flex justify-content-between w-100 px-4">
                        <Container className='p-0 d-flex gap-4 align-items-center'>
                            <Link style={{ color: 'white', textDecoration: 'none', }} to="/">
                                <span style={{ color: 'white', textDecoration: 'none', }}>Home</span>
                            </Link>
                            {localStorage.getItem('isAdmin') && <Link style={{ color: 'white', textDecoration: 'none', }} to="/users">
                                <span style={{ color: 'white', textDecoration: 'none', }}>Users</span>
                            </Link>}
                        </Container>
                        <p className='mb-auto mt-auto' style={{ color: 'white' }}>Logged in as: {username}</p>
                        {/* <Nav.Link href="#pricing">Pricing</Nav.Link>
                        <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                    <Button variant="danger" onClick={handleLogout}>Logout</Button>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

