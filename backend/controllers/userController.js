import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js"
import User from "../models/userModel.js"


const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile
    })
  } else {
    console.log("Invalid email or password");
    res.status(401);
    throw new Error('Invalid email or password')
  }
})


const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  const profile = `${req.file.filename}`

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400);
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    profile
  });

  if (user) {
    generateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
    })
  } else {
    res.status(400);
    throw new Error('Invalid user data')
  }
})


const logoutUser = asyncHandler(async (req, res) => {

  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })

  res.status(200).json({ message: 'User Logged Out' })
})


const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    profile: req.user.profile
  }
  res.status(200).json(user)
})


const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const profile = `${req.file.filename}`

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profile = req?.file?.filename || user.profile;

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profile: updatedUser.profile
    })
  } else {
    res.status(401);
    throw new Error('User not found')
  }
})


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
};
