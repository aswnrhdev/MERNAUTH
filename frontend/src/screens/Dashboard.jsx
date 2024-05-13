import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { Button, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FaUser } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useGetUsersDataMutation,
  useDeleteUserMutation,
  useUpdateUserAdminMutation,
  useAdminLogoutMutation
} from '../slices/adminApiSlice.js'

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logout, adminLogout } from '../slices/authSlice'
import { NavLink } from "react-router-dom";
import { staticPath } from "../../constants.js";
import AddNewUser from "./AddNewUser.jsx";

function DashBoard() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [userId, setUserId] = useState(null)
  const [data, setData] = useState(true)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState([])

  const [showEditModal, setEditModal] = useState(false);
  const [userDataForEdit, setUserDataForEdit] = useState()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [getUsersData] = useGetUsersDataMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserAdminMutation();
  const [logoutAdminApiCall] = useAdminLogoutMutation();

  const { userInfo } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const res = await getUsersData().unwrap("");
      setUsers(res.users);
    }
    fetchUser();
  }, [data, getUsersData, updateModalOpen]);


  useEffect(() => {
    const filterUsers = () => {
      const filtered = users.filter((user) => {
        const userName = user.name.toLowerCase();
        const userEmail = user.email.toLowerCase();
        const searchValue = search.toLowerCase();
        return (
          userName.includes(searchValue) || userEmail.includes(searchValue)
        );
      });
      setFilteredUsers(filtered);
    };
    if (users) {
      filterUsers();
    }
  }, [users, search]);


  const handleDelete = async (userId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {

        if (userId) {
          await deleteUser(userId).unwrap("");

          setData((prevData) => !prevData);
          setUserId(null);
          setIsOpen(false);
          if (userInfo && userInfo._id === userId) {
            dispatch(logout());
          }
        }
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "User was not deleted",
          icon: "error"
        });
      }
    });
  };




  const handleClose = () => setEditModal(false);
  const handleShow = (userData) => {
    setEditModal(true);
    console.log(userData);
    // setUserId(userData._id)
    setUserDataForEdit(userData)
  }

  const handleUpdate = async () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const nameRegex = /^[^\s]+(\s[^\s]+)*$/;
    const mobileRegex = /^(?![0-5])\d{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    console.log(userDataForEdit);
    const name = userDataForEdit.name
    const email = userDataForEdit.email
    const _id = userDataForEdit._id

    if (!name || !email) {
      toast.error("All fields should be filled");
    } else if (!name.match(nameRegex)) {
      toast.error("Name cannot contain consecutive spaces");
    } else if (!email.match(emailRegex)) {
      toast.error("Invalid email address");
    } else {
      try {
        const res = await updateUser({
          _id,
          name,
          email,
        }).unwrap("");
        console.log(res);
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
      handleClose();
    }
  };


  const handleLogout = async () => {
    try {
      await logoutAdminApiCall().unwrap();
      dispatch(adminLogout());
      navigate("/admin");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <Navbar expand='lg' style={{
        marginLeft: '-120px',
        marginRight: '-120px',
        marginTop: '-11px',
        padding: '5px',
        backgroundColor: '#E0CCBE',
      }}>
        <Navbar.Brand className="my-4 display-3 fw-bold ls-tight px-3" href="/dashboard" style={{ color: '#3C3633', marginLeft: '50px', fontSize: '35px' }}>Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <button style={{
            padding: '9px',
            width: "150px",
            marginRight: '50px',
            backgroundColor: '#3C3633',
            color: '#EEEDEB',
            border: 'none',
            transition: 'background-color 0.3s',
          }} onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </Navbar.Collapse>
      </Navbar>

      <p className="mt-3">To add a new user, kindly click the button below and complete the required fields.</p>
      <AddNewUser />

      {/* 
      <form className="form-inline">
        <input className="form-control mr-sm-2 bg-light text-dark border-dark mt-3" onChange={(e) => setSearch(e.target.value)} type="search" value={search} placeholder="Search Users" aria-label="Search" />
      </form> */}

      <p className="mt-3">The table below contains a list of users in the database. You can search, update, and remove users from it.</p>








      <table className="table mt-5" style={{ width: '80%' }}>
        <thead>
          <tr>
            <th className='p-3' scope="col" style={{ width: '20%' }}>Profile Image</th>
            <th className='p-3' scope="col" style={{ width: '20%' }}>User Name</th>
            <th className='p-3' scope="col" style={{ width: '30%' }}>Email</th>
            <th className='p-3' scope="col" style={{ width: '30%' }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((obj, index) => (
            <tr key={index} >
              <td className='p-4'>
                <img src={`${staticPath + obj.profile}`} style={{ 'height': '60px', 'width': '60px', 'borderRadius': '40px' }} alt="dd" />
              </td>
              <td className='p-4'>{obj.name}</td>
              <td className='p-4'>{obj.email}</td>
              <td>
                <button className="m-2 btn btn-light">
                  <FaUserEdit
                    onClick={() => handleShow(obj)}
                    size={18}
                    style={{ color: '#3C3633', 'width': '30px', transition: "color 0.3s ease" , width: '40px', border: 'none'}}
                  />
                </button>

                <button onClick={() => handleDelete(obj._id)} className="m-2 btn btn-danger" >
                  <MdDelete
                    size={18}
                    style={{ color: "black", transition: "color 0.3s ease", width: '40px', border: 'none'}}
                  />
                </button>

                
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      

<Modal show={showEditModal} onHide={handleClose}>
      <Modal.Header closeButton style={{ backgroundColor: '#E0CCBE' }}>
        <Modal.Title className=" display-3 fw-bold ls-tight px-3" style={{ color: '#3C3633', fontSize: '30px' }}>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Name*</Form.Label>
            <Form.Control
              type="name"
              value={userDataForEdit?.name}
              placeholder="Enter a name here"
              onChange={(e) => { setUserDataForEdit({ ...userDataForEdit, name: e.target.value }) }}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email*</Form.Label>
            <Form.Control
              type="email"
              value={userDataForEdit?.email}
              placeholder="Enter an email here"
              onChange={(e) => { setUserDataForEdit({ ...userDataForEdit, email: e.target.value }) }}
              autoFocus
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#E0CCBE' }}>
        <Button variant="secondary" onClick={handleClose} style={{'width': '120px', background: '#EEEDEB', color: '#3C3633', border: 'none'}}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdate} style={{'width': '120px',  background: '#3C3633', border: 'none'}}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );





}

export default DashBoard;
