import { Container, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate()

    const handleSignIn = () => {
        navigate('/login')
    }

    const handleSignUp = () => {
        navigate('/register')
    }

    // Define the colors from the palette
    const cardColor = '#CDE8E5';
    const fontColor = '#4D869C';

    return (
        <div className='py-5'>
            <Container className='d-flex justify-content-center'>
                <Card className='p-5 d-flex flex-column align-items-center hero-card' style={{ backgroundColor: cardColor, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', color: fontColor, border: 'none' }}>
                    <h1 className="my-4 display-3 fw-bold ls-tight px-3" style={{ color: '#4D869C' }}>MERN CLEANSE</h1>
                    <p className='text-center mb-4'>
                        MERN-Cleanse is a comprehensive project built on MongoDB, Express, React, and Node.js (MERN stack). It serves as a boilerplate for MERN Authentication, featuring JWT storage in HTTP-Only cookies for enhanced security. Leveraging Redux Toolkit and the React Bootstrap library, it offers robust functionality for streamlined development.
                    </p>


                    <div className='d-flex'>


                        {!userInfo ? (<div className="d-flex">

                            <button
                                type="submit"
                                className="btn btn-dark mt-3 p-2 border-0 me-2"
                                style={{
                                    width: "130px",
                                    backgroundColor: '#4D869C',
                                    color: '#EEF7FF',
                                    transition: 'background-color 0.3s',
                                }}
                                onClick={handleSignIn}
                            >
                                Sign In
                            </button>
                            <button
                                type="submit"
                                className="btn btn-dark mt-3 p-2 border-0"
                                style={{
                                    width: "130px",
                                    backgroundColor: '#4D869C',
                                    color: '#EEF7FF',
                                    transition: 'background-color 0.3s',
                                }}
                                onClick={handleSignUp}
                            >
                                Sign Up
                            </button>
                        </div>) : null}

                    </div>

                </Card>
            </Container>
        </div>
    );
}

export default Hero;
