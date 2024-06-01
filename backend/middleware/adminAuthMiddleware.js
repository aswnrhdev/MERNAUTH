import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECERT);
            req.user = await Admin.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            throw new Error("Not authorized, no token");
        }
    } else {
        console.log('No Token');
    }
})

export { protect }