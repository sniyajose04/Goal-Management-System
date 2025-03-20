const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')

const protectAdmin = asyncHandler(async (req, res, next) => {
    let token;
    //bearer - type of the token we used
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];


            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get admin from token
            req.admin = await User.findById(decoded.id).select('-password');
            next();

        } catch (error) {
            console.log('Error in protect middleware:', error);
            res.status(401)
            throw new Error('Not authorized');
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token');
    }
});


module.exports = { protectAdmin }