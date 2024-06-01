
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

    const handleImageRemove = () => {
        setImage(null);
        setPhoto(null);
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        const emailRegex = /^\S+@\S+\.\S+$/;
        const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z0-9]).{6,}$/;
        const nameRegex = /^[^\s]+(\s[^\s]+)*$/;

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

            handleRegistration(formData);
        }
    }

    const handleRegistration = async (formData) => {
        try {
            const res = await register(formData).unwrap();
            dispatch(setCredentials({ ...res }))
            navigate('/')
            console.log('Registration successful:', res);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }

    return (
        <div className="container pt-5 mt-1 background-radial-gradient">
            <div className="row">
                <div className="col-md-7 mx-auto">
                    <div className="card p-5 shadow-lg border-0" style={{ backgroundColor: '#CDE8E5', transition: 'background-color 0.3s', marginBottom: '50px' }}>
                        <div className="text-center text-md-start">
                            <h1 className="my-4 display-3 fw-bold ls-tight px-3" style={{ color: '#4D869C' }}>
                                Sign Up.
                            </h1>

                            <form onSubmit={submitHandler}>
                                <div className="form-group pt-1">
                                    <label htmlFor="name" className="mb-3" style={{ color: '#4D869C' }}>
                                        Name*
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter the name"
                                    />
                                </div>

                                <div className="form-group my-3">
                                    <label htmlFor="email" className="mb-3" style={{ color: '#4D869C' }}>
                                        Email*
                                    </label>
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        id="email"
                                        value={email}
                                        type="email"
                                        placeholder="Enter the email"
                                        className="form-control"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        style={{ 'display': 'none' }}
                                        onChange={handleImageChange}
                                        ref={inputRef}
                                    />

                                    <img
                                        onClick={handleImgClick}
                                        className="h-1 w-1 rounded-full max-md:ml-20 mt-2"
                                        style={{ 'height': '100px', 'width': '100px', 'cursor': 'pointer' }}
                                        src={image}
                                        alt=""
                                    />
                                    {image ? (
                                        <button className="btn btn-danger rounded-circle" onClick={handleImageRemove} >X</button>
                                    ) : (
                                        <label className='my-4' htmlFor="fileInput">
                                            <strong className='m-4' style={{ 'cursor': 'pointer', color: '#4D869C' }}>Choose Image</strong>
                                        </label>
                                    )}
                                </div>

                                <div className="form-group my-3 d-flex">
                                    <div style={{ marginRight: '10px', flex: 1 }}>
                                        <label htmlFor="password" className="mb-3" style={{ color: '#4D869C' }}>
                                            Password*
                                        </label>
                                        <input
                                            onChange={(e) => setPassword(e.target.value)}
                                            id="password"
                                            value={password}
                                            type="password"
                                            placeholder="Enter the password"
                                            className="form-control"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label htmlFor="confirmPassword" className="mb-3" style={{ color: '#4D869C' }}>
                                            Confirm*
                                        </label>
                                        <input
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            type="password"
                                            placeholder="Confirm Password"
                                            className="form-control"
                                        />
                                    </div>
                                </div>


                                {isLoading && <Loader />}

                                <button
                                    type="submit"
                                    className="btn btn-dark mt-3 p-2 border-0"
                                    style={{
                                        width: "200px",
                                        backgroundColor: '#4D869C',
                                        color: '#EEF7FF',
                                        transition: 'background-color 0.3s',
                                    }}
                                >
                                    Sign Up
                                </button>

                                <p className="mt-5" style={{ color: '#4D869C' }}>Already have an account? Tap <Link to='/login' style={{ color: '#77B0AA' }}>Login</Link> to sign in.</p>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterScreen
