import express from 'express';
const adminRoute = express.Router();
import { protect } from '../middleware/authMiddleware.js'; // Import the protect middleware
import {
    authAdmin,
    blockUnblockUser,
    deleteUser,
    getUsers,
    logoutAdmin,
    updateUserProfile
} from "../controllers/adminController.js";

adminRoute.post('/auth', authAdmin);
adminRoute.post('/logout', logoutAdmin);

// Protected routes
adminRoute.get('/users', protect, getUsers);
adminRoute.delete('/users/delete', protect, deleteUser);
adminRoute.patch('/users/blockUnblock', protect, blockUnblockUser);
adminRoute.put('/users/updateUser', protect, updateUserProfile);

export default adminRoute;
