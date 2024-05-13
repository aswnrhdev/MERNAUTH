import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { BsDoorOpenFill } from "react-icons/bs";
import { BsBoxArrowRight } from "react-icons/bs";
import { FaReact } from "react-icons/fa";
const Header = () => {
    const { userInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [logoutApiCall] = useLogoutMutation();
    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/')
        } catch (err) {
            console.log(err);
        }
    }

    const paletteColor = '#3C5B6F';


    return (
        <header>
            <Navbar style={{ backgroundColor: paletteColor }} variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand className="my-2 display-3 fw-bold ls-tight px-2" style={{ color: '#4D869C' }}>MERN Cleanse <FaReact style={{ marginBottom: '7'}} />
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            {userInfo ? (
                                <>
                                    <NavDropdown title={userInfo.name} id='username'>
                                        <LinkContainer to='/profile'>
                                            <NavDropdown.Item>
                                                Profile
                                            </NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>
                                            Logout
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                    <LinkContainer to='/login'>
                                        <Nav.Link>
                                            <BsBoxArrowRight /> Sign In
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to='/register'>
                                        <Nav.Link>
                                            <BsBoxArrowRight /> Sign Up
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header;
