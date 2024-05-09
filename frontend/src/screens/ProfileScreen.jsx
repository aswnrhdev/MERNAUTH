import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer';

import { setCredentials } from "../slices/authSlice";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { toast } from 'react-toastify'
import Loader from "../components/Loader";
import { staticPath } from "../../constants";

const ProfileScreen = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [image, setImage] = useState()
    const [profile, setProfile] = useState()

    const [editProf, setEditProf] = useState(false)
    const [cancelBtn, setCancelBtn] = useState(true)
    const [cancelChanges, setCancelChanges] = useState(true)

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const { userInfo } = useSelector((state) => state.auth);
    const [updateProfile, { isLoading }] = useUpdateUserMutation();
    const inputRef = useRef()

    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);
        setProfile(userInfo.profile);
        setImage(null)
    }, [userInfo, navigate, cancelChanges])

    const handleImageChange = (e) => {
        setImage(e.target.files[0])

        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setView(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }


    const submitHandler = async (e) => {
        e.preventDefault();
        const emailRegex = /^\S+@\S+\.\S+$/;
        const passwordRegex =
            /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z0-9]).{6,}$/;

        const nameRegex = /^[^\s]+(\s[^\s]+)*$/;

        // Check if any field is empty
        if (!name || !email) {
            toast.error("All fields should be filled");
        } else if (!name.match(nameRegex)) {
            toast.error("Name cannot contain consecutive spaces");
        } else if (!email.match(emailRegex)) {
            toast.error("Invalid email address");
        } else if (password && !password.match(passwordRegex)) {
            toast.error(
                "Password must be at least 6 characters and contain at least one special character"
            );
        } else if (password && password !== confirmPassword) {
            toast.error("Password do not match");
        } else {
            try {
                const formData = new FormData();
                formData.append('name', name)
                formData.append('email', email);
                formData.append('password', password);
                if (image) {
                    console.log(image);
                    formData.append('profile', image);
                } else {
                    formData.append('profile', profile);
                }

                const res = await updateProfile(formData).unwrap();

                dispatch(setCredentials(res));
                toast.success("Profile updated successfully");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };



    return (

        <FormContainer>
            <div className='d-flex justify-content-center my-3'>
                <h1> Update Profile</h1>
            </div>

            <div className='d-flex justify-content-center'>
                {image ? <img src={image && URL.createObjectURL(image)} style={{ 'height': '100px', 'width': '100px', 'borderRadius': '40px', 'cursor': 'pointer' }} /> : (
                    <img onClick={() => setEditProf(!editProf)} src={`${staticPath + profile}`} style={{ 'height': '100px', 'width': '100px', 'borderRadius': '40px', 'cursor': 'pointer' }} />
                )}
            </div>

            <div className="w-1/2 grid items-center justify-center">
                <div className="flex">
                    <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        style={{
                            'display': 'none'
                        }}
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    {editProf ? (<div className="d-flex justify-content-center">
                        <label className='my-4' htmlFor="fileInput">
                            <span className='m-4' style={{ 'cursor': 'pointer' }}>Edit📋</span>
                        </label>
                    </div>) : null}

                </div>
            </div>

            <Form onSubmit={submitHandler}>
                {/* NAME */}
                <Form.Group className='my-2' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text'
                        placeholder='Enter your Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                {/* EMAIL */}
                <Form.Group className='my-2' controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}>
                    </Form.Control>
                </Form.Group>


                {/* password */}
                <Form.Group className='my-2' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                {/* confirm password */}
                <Form.Group className='my-2' controlId='confirmPassword'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>

                {isLoading && <Loader />}
                <div className="d-flex justify-content-center mt-4">
                    <Button type='submit' variant='secondary' className='m-4'>
                        Update
                    </Button>

                    {cancelBtn ? (<Button type='button' onClick={() => setCancelChanges(!cancelChanges)} variant='dark' className='m-4'>
                        Restore to default
                    </Button>) : null}
                </div>

            </Form>
        </FormContainer>
    )
}

export default ProfileScreen