import React, { useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";

const AddNewUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [register] = useRegisterMutation();

  const handleImageChange = (e) => {
    setPhoto(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const submitRegisterHandler = async (e) => {
    e.preventDefault();

    // Regular expression for password validation (at least 6 characters with at least one special character)
    const emailRegex = /^\S+@\S+\.\S+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z0-9]).{6,}$/;
    const nameRegex = /^[^\s]+(\s[^\s]+)*$/;

    // Check if any field is empty
    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields should be filled");
      return;
    }

    if (!name.match(nameRegex)) {
      toast.error("Name cannot contain consecutive spaces");
      return;
    }

    if (!email.match(emailRegex)) {
      toast.error("Invalid email address");
      return;
    }

    if (!password.match(passwordRegex)) {
      toast.error("Password must be at least 6 characters and contain at least one special character");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }

    if (!image) {
      toast.error("Add a profile image");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('photo', photo);

    try {
      const res = await register(formData).unwrap();
      toast.success("User registered successfully");
      navigate('/dashboard');
      toggleModal(); // Close the modal after successful registration
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button style={{
        padding: '9px',
        width: "150px",
        marginRight: '50px',
        backgroundColor: '#3C3633',
        color: '#EEEDEB',
        border: 'none',
        transition: 'background-color 0.3s',
      }} onClick={toggleModal}>Add User</Button>
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton style={{ backgroundColor: '#E0CCBE' }}>
          <Modal.Title className=" display-3 fw-bold ls-tight px-3" style={{ color: '#3C3633', fontSize: '30px' }}>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitRegisterHandler}>
            <Form.Group controlId="name" className="my-3">
              <Form.Label>Name*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email Address*</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter the email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            {/* Profile image */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {image && (
              <img
                className="preview-image"
                src={image}
                alt="Preview"
                style={{ width: '100px', height: '100px' }}
              />
            )}

            <Form.Group controlId="password" className="my-3">
              <Form.Label>Password*</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter the Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="my-3">
              <Form.Label>Confirm Password*</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            {isLoading && <Loader />}
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#E0CCBE' }}>
          <Button variant="secondary" onClick={toggleModal} style={{ 'width': '120px', background: '#EEEDEB', color: '#3C3633', border: 'none' }}>
            Close
          </Button>
          <Button type="submit" variant="primary" onClick={submitRegisterHandler} disabled={isLoading} style={{ 'width': '120px', background: '#3C3633', border: 'none' }}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNewUser;
