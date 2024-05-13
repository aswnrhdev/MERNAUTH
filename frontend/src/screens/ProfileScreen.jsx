// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from 'react-router-dom'
// import { Form, Button } from 'react-bootstrap'
// import { useDispatch, useSelector } from 'react-redux'
// import FormContainer from '../components/FormContainer';

// import { setCredentials } from "../slices/authSlice";
// import { useUpdateUserMutation } from "../slices/usersApiSlice";
// import { toast } from 'react-toastify'
// import Loader from "../components/Loader";
// import { staticPath } from "../../constants";

// const ProfileScreen = () => {

//     const [name, setName] = useState('')
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [confirmPassword, setConfirmPassword] = useState('')
//     const [image, setImage] = useState()
//     const [profile, setProfile] = useState()

//     const [editProf, setEditProf] = useState(false)
//     const [cancelBtn, setCancelBtn] = useState(true)
//     const [cancelChanges, setCancelChanges] = useState(true)

//     const navigate = useNavigate();
//     const dispatch = useDispatch();


//     const { userInfo } = useSelector((state) => state.auth);
//     const [updateProfile, { isLoading }] = useUpdateUserMutation();
//     const inputRef = useRef()

//     useEffect(() => {
//         setName(userInfo.name);
//         setEmail(userInfo.email);
//         setProfile(userInfo.profile);
//         setImage(null)
//     }, [userInfo, navigate, cancelChanges])

//     const handleImageChange = (e) => {
//         setImage(e.target.files[0])

//         const file = e.target.files[0]
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setView(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     }


//     const submitHandler = async (e) => {
//         e.preventDefault();
//         const emailRegex = /^\S+@\S+\.\S+$/;
//         const passwordRegex =
//             /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z0-9]).{6,}$/;

//         const nameRegex = /^[^\s]+(\s[^\s]+)*$/;

//         // Check if any field is empty
//         if (!name || !email) {
//             toast.error("All fields should be filled");
//         } else if (!name.match(nameRegex)) {
//             toast.error("Name cannot contain consecutive spaces");
//         } else if (!email.match(emailRegex)) {
//             toast.error("Invalid email address");
//         } else if (password && !password.match(passwordRegex)) {
//             toast.error(
//                 "Password must be at least 6 characters and contain at least one special character"
//             );
//         } else if (password && password !== confirmPassword) {
//             toast.error("Password do not match");
//         } else {
//             try {
//                 const formData = new FormData();
//                 formData.append('name', name)
//                 formData.append('email', email);
//                 formData.append('password', password);
//                 if (image) {
//                     console.log(image);
//                     formData.append('profile', image);
//                 } else {
//                     formData.append('profile', profile);
//                 }

//                 const res = await updateProfile(formData).unwrap();

//                 dispatch(setCredentials(res));
//                 toast.success("Profile updated successfully");
//             } catch (err) {
//                 toast.error(err?.data?.message || err.error);
//             }
//         }
//     };



//     return (

//         <FormContainer>
//             <div className='d-flex justify-content-center my-3'>
//                 <h1> Update Profile</h1>
//             </div>

//             <div className='d-flex justify-content-center'>
//                 {image ? <img src={image && URL.createObjectURL(image)} style={{ 'height': '100px', 'width': '100px', 'borderRadius': '40px', 'cursor': 'pointer' }} /> : (
//                     <img onClick={() => setEditProf(!editProf)} src={`${staticPath + profile}`} style={{ 'height': '100px', 'width': '100px', 'borderRadius': '40px', 'cursor': 'pointer' }} />
//                 )}
//             </div>

//             <div className="w-1/2 grid items-center justify-center">
//                 <div className="flex">
//                     <input
//                         type="file"
//                         id="fileInput"
//                         accept="image/*"
//                         style={{
//                             'display': 'none'
//                         }}
//                         onChange={(e) => setImage(e.target.files[0])}
//                     />

//                     {editProf ? (<div className="d-flex justify-content-center">
//                         <label className='my-4' htmlFor="fileInput">
//                             <span className='m-4' style={{ 'cursor': 'pointer' }}>Edit📋</span>
//                         </label>
//                     </div>) : null}

//                 </div>
//             </div>

//             <Form onSubmit={submitHandler}>
//                 {/* NAME */}
//                 <Form.Group className='my-2' controlId='name'>
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control type='text'
//                         placeholder='Enter your Name'
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}>
//                     </Form.Control>
//                 </Form.Group>

//                 {/* EMAIL */}
//                 <Form.Group className='my-2' controlId='email'>
//                     <Form.Label>Email Address</Form.Label>
//                     <Form.Control type='email'
//                         placeholder='Enter Email'
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}>
//                     </Form.Control>
//                 </Form.Group>


//                 {/* password */}
//                 <Form.Group className='my-2' controlId='password'>
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control type='password'
//                         placeholder='Enter password'
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}>
//                     </Form.Control>
//                 </Form.Group>

//                 {/* confirm password */}
//                 <Form.Group className='my-2' controlId='confirmPassword'>
//                     <Form.Label>Confirm Password</Form.Label>
//                     <Form.Control type='password'
//                         placeholder='Confirm Password'
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}>
//                     </Form.Control>
//                 </Form.Group>

//                 {isLoading && <Loader />}
//                 <div className="d-flex justify-content-center mt-4">
//                     <Button type='submit' variant='secondary' className='m-4'>
//                         Update
//                     </Button>

//                     {cancelBtn ? (<Button type='button' onClick={() => setCancelChanges(!cancelChanges)} variant='dark' className='m-4'>
//                         Restore to default
//                     </Button>) : null}
//                 </div>

//             </Form>
//         </FormContainer>
//     )
// }

// export default ProfileScreen



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
import { TbMoodEdit } from "react-icons/tb";

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
        const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z0-9]).{6,}$/;
        const nameRegex = /^[^\s]+(\s[^\s]+)*$/;

        // Check if any field is empty
        if (!name || !email) {
            toast.error("All fields should be filled");
        } else if (!name.match(nameRegex)) {
            toast.error("Name cannot contain consecutive spaces");
        } else if (!email.match(emailRegex)) {
            toast.error("Invalid email address");
        } else if (password && !password.match(passwordRegex)) {
            toast.error("Password must be at least 6 characters and contain at least one special character");
        } else if (password && password !== confirmPassword) {
            toast.error("Passwords do not match");
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
        <div className="container pt-5 mt-1 background-radial-gradient">
            <div className="row justify-content-center">
                <div className="col-md-7">
                
                    <div className="card p-4 shadow-lg border-0" style={{ backgroundColor: '#CDE8E5', transition: 'background-color 0.3s' }}>
                        <div className="text-center text-md-start">
                            <h5 className="my-1 display-3 fw-bold ls-tight px-3" style={{ color: '#4D869C', fontSize: '50px'}}>Profile.</h5>
                            <div className='d-flex justify-content-center align-items-center mb-2 mt-3'>
                                {image ?
                                    <img
                                        src={image && URL.createObjectURL(image)}
                                        style={{
                                            'height': '100px',
                                            'width': '100px',
                                            'borderRadius': '50%' // Set border-radius to 50% for a circle
                                        }}
                                    />
                                    :
                                    (
                                        <img
                                            onClick={() => setEditProf(!editProf)}
                                            src={`${staticPath + profile}`}
                                            style={{
                                                'height': '100px',
                                                'width': '100px',
                                                'borderRadius': '50%', // Set border-radius to 50% for a circle
                                                'cursor': 'pointer'
                                            }}
                                        />
                                    )
                                }
                            </div>
    
                            <Form onSubmit={submitHandler}>
                                {/* Profile Picture */}
                                <div className="d-flex justify-content-center mb-4">
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        style={{ 'display': 'none' }}
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
    
                                    <label className='my-1' htmlFor="fileInput">
                                        <span className='' style={{ 'cursor': 'pointer', color: '#4D869C' }}>Change <TbMoodEdit /></span>
                                    </label>
                                </div>
    
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        {/* Name */}
                                        <Form.Group controlId='name'>
                                            <Form.Label style={{ color: '#4D869C' }}>Name</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter your Name'
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Email */}
                                        <Form.Group controlId='email'>
                                            <Form.Label style={{ color: '#4D869C' }}>Email Address</Form.Label>
                                            <Form.Control
                                                type='email'
                                                placeholder='Enter Email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
    
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        {/* Password */}
                                        <Form.Group controlId='password'>
                                            <Form.Label style={{ color: '#4D869C' }}>Password</Form.Label>
                                            <Form.Control
                                                type='password'
                                                placeholder='Enter password'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        {/* Confirm Password */}
                                        <Form.Group controlId='confirmPassword'>
                                            <Form.Label style={{ color: '#4D869C' }}>Confirm Password</Form.Label>
                                            <Form.Control
                                                type='password'
                                                placeholder='Confirm Password'
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
    
                                {isLoading && <Loader />}
                                <div className="d-flex justify-content-center mt-4">
                                    <Button type='submit' variant='secondary' className='m-4' style={{
                                    width: "160px",
                                    backgroundColor: '#4D869C',
                                    color: '#EEF7FF',
                                    transition: 'background-color 0.3s',
                                    border: 'none'
                                }}>Update</Button>
    
                                    {cancelBtn ? (
                                        <Button type='button' onClick={() => setCancelChanges(!cancelChanges)} variant='dark' className='m-4' style={{
                                            width: "160px",
                                            backgroundColor: '#7AB2B2',
                                            color: '#EEF7FF',
                                            transition: 'background-color 0.3s',
                                            border: 'none'
                                        }}>
                                            Restore to default
                                        </Button>
                                    ) : null}
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default ProfileScreen
