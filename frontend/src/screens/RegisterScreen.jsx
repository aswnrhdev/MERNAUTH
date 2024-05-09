import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer';
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify'
import Loader from "../components/Loader";

const RegisterScreen = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [image, setImage] = useState(null)
    const [photo, setPhoto] = useState(null)

    const inputRef = useRef()

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const { userInfo } = useSelector((state) => state.auth);
    const [register, { isLoading }] = useRegisterMutation();


    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo])

    const handleImageChange = (e) => {
        setPhoto(e.target.files[0])
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleImgClick = () => {
        inputRef.current.click()
    }


    const submitHandler = async (e) => {
        e.preventDefault();


        const emailRegex = /^\S+@\S+\.\S+$/;
        const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z0-9]).{6,}$/;
        const nameRegex = /^[^\s]+(\s[^\s]+)*$/;

        // Check if any field is empty
        if (!name || !email || !password) {
            toast.error("All fields should be filled");
        } else if (!name.match(nameRegex)) {
            toast.error("Name cannot contain consecutive spaces");
        } else if (!email.match(emailRegex)) {
            toast.error("Invalid email address");
        } else if (!password.match(passwordRegex)) {
            toast.error(
                "Password must be at least 6 characters and contain at least one special character"
            );
        } else if (password !== confirmPassword) {
            toast.error("Password do not match");
        } else if (!image) {
            toast.error(
                "Add a profile image"
            )
        } else {

            const formData = new FormData();
            formData.append('name', name)
            formData.append('email', email);
            formData.append('password', password);
            formData.append('photo', photo);

            console.log(formData.get('photo'));

            handleRegistration(formData);

        }
    }

    const handleRegistration = async (formData) => {
        try {
            console.log('In handle Registration');
            const res = await register(formData).unwrap();

            dispatch(setCredentials({ ...res }))
            navigate('/')
            console.log('Registration successful:', res);
        } catch (error) {
            console.error('Registration failed:', error);
        }

    }

    return (
        <FormContainer>
            <h1>Sign Up</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="name">
                    <Form.Label>Name*</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter the name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="email">
                    <Form.Label>Email Address*</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter the email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <div className="w-1/2 grid items-center justify-center">
                    <div className="flex">
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            ref={inputRef}
                            style={{
                                'display': 'none'
                            }}
                            onChange={handleImageChange}
                        />

                        <img
                            onClick={handleImgClick}
                            className="h-1 w-1 rounded-full max-md:ml-20 mt-3"
                            style={{ 'height': '100px', 'width': '100px', 'cursor': 'pointer' }}
                            src={image}
                            alt="."
                        />
                        {image ? null : (
                            <label className='my-4' htmlFor="fileInput">
                                <strong className='m-4' style={{ 'cursor': 'pointer' }}>Choose a profile image</strong>
                            </label>
                        )}
                    </div>
                </div>

                <Form.Group className="my-2" controlId="password">
                    <Form.Label>Password*</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter the Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="Confirmpassword">
                    <Form.Label>Confirm Password*</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                {isLoading && <Loader />}

                <Button type="submit" variant="primary" className="mt-3">
                    Sign Up
                </Button>

                <Row className="py-3">
                    <Col>
                        Already have an account? <Link to='/login'>Login</Link>
                    </Col>
                </Row>
            </Form>
        </FormContainer>
    )
}

export default RegisterScreen