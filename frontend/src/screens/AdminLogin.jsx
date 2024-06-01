import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAdminLoginMutation } from "../slices/adminApiSlice";
import { setAdminCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { RiHome2Line } from "react-icons/ri";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useAdminLoginMutation();

  const { adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (adminInfo) {
      navigate("/dashboard");
    }
  }, [navigate, adminInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setAdminCredentials({ ...res }));
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container pt-5 mt-5 background-radial-gradient">
      <div className="row">
        <div className="col-md-7 mx-auto">
          <div className="card p-5 shadow-lg border-0" style={{ backgroundColor: '#E0CCBE', transition: 'background-color 0.3s' }}>
            <div className="text-center text-md-start">
              <h1 className="my-4 display-3 fw-bold ls-tight px-3" style={{ color: '#747264' }}>
                Admin Login.
              </h1>

              <form>
                <div className="form-group pt-1">
                  <label htmlFor="email" className="mb-3" style={{ color: '#747264' }}>
                    Email*
                  </label>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="form-control"
                    id="email"
                    placeholder=""
                  />
                </div>
                <div className="form-group my-3">
                  <label htmlFor="password" className="mb-3" style={{ color: '#747264' }}>
                    Password*
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    value={password}
                    type="password"
                    placeholder=""
                    className="form-control"
                  />
                </div>

                <div className="d-flex justify-content-start">
                  <button
                    onClick={submitHandler}
                    type="button"
                    className="btn btn-dark mt-3 p-2 border-0"
                    style={{
                      width: "200px",
                      backgroundColor: '#3C3633',
                      color: '#E0CCBE',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <div className="d-flex justify-content-start align-items-center mt-5">
                {/* Home icon */}
                <div style={{ width: '30px', height: '25px', borderRadius: '50%', background: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginRight: '10px' }}>
                  <RiHome2Line
                    style={{ color: '#000000' }}
                    size={20}
                    onClick={() => navigate("/")}
                  />
                </div>
                <p style={{ margin: 0, color: '#747264' }}>You can press the home icon if you're not an admin.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
