import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify'
import Loader from "../components/Loader";

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }))
            navigate('/')
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (



        <div className="container pt-5 mt-1 background-radial-gradient">
      <div className="row">
        <div className="col-md-7 mx-auto">
          <div className="card p-5 shadow-lg border-0" style={{ backgroundColor: '#CDE8E5', transition: 'background-color 0.4s' }}>
            <div className="text-center text-md-start">
              <h1 className="my-4 display-3 fw-bold ls-tight px-3" style={{ color: '#4D869C' }}>
                Sign In.
              </h1>

              <form>
                <div className="form-group pt-1">
                  <label htmlFor="email" className="mb-3" style={{ color: '#4D869C' }}>
                    Email*
                  </label>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="form-control"
                    id="email"
                    placeholder="Enter the email"
                  />
                </div>
                <div className="form-group my-3">
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

                {isLoading && <Loader />}

                <div className="d-flex justify-content-start">
                  <button
                    onClick={submitHandler}
                    type="button"
                    className="btn btn-dark mt-3 p-2 border-0"
                    style={{
                      width: "200px",
                      backgroundColor: '#4D869C',
                      color: '#EEF7FF',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    Sign in
                  </button>
                </div>

                    <p className="mt-5" style={{ color: '#4D869C' }}>New to Mern Cleanse? Tap <Link to='/register' style={{color: '#77B0AA'}}>Regsiter</Link> to create an account.</p>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>

    )
}

export default LoginScreen