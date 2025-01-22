const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')

//@dec Register new user
//@route POST/api/users
//@access Public

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    //Check  if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    //  hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        name, email, password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token:generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// const registerUser = asyncHandler(async (req, res) => {
//     const { name, email, password } = req.body
//     console.log(req.body)
//     if (!name || !email || !password) {
//         res.status(400)
//         throw new Error('Please add all fields')
//     }

//     //Check  if user exists
//     const userExists = await User.findOne({ email })
//     if (userExists) {
//         res.status(400)
//         throw new Error('User already exists')
//     }

//     //hash password
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     //create user
//     const user = await User.create({
//         name, email, password: hashedPassword
//     })
// console.log(user.password)
//     if (user) {
//         res.status(201).json({
//             _id: user.id,
//             name: user.name,
//             email: user.email,
//             token:generateToken(user._id)
//         })
//     } else {
//         res.status(400)
//         throw new Error('Invalid user data')
//     }
// })



// //@dec Authenticate a user
// //@route POST/api/users/login
// //@access Public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token:generateToken(user._id)
        })
        res.json(responseData);

    } else {
        res.status(400).json({ message: 'Invalid credentials' })
    }
})

// const loginUser = asyncHandler(async (req, res) => {
//     const {email,password} = req.body

//     console.log(req.body)
//     //check for user email
//     const user = await User.findOne({email})

//     if(user && (await bcrypt.compare(password,user.password))){
//         console.log("Login successful"); // Add this log
//         res.json({
//             _id:user.id,
//             name:user.name,
//             email:user.email,
//             token:generateToken(user._id)
//         })
//         console.log("Response Data:", responseData);
// res.json(responseData);

//     }else{
//         console.log("Invalid credentials"); 
//         res.status(400)
//         throw new Error('Invalid credentials')
//     }
//     console.log("Stored Password:", user.password); // Should be hashed
// console.log("Incoming Password:", password);    // Plain text
// console.log("Password Match:", await bcrypt.compare(password, user.password));

// })


// //@dec Get user data
// //@route GeT/api/users/me
// //@access Private

const getMe = asyncHandler(async (req, res) => {
    const {_id,name,email} = await User.findById(req.user.id)

    res.status(200).json({
        id:_id,
        name,
        email
    })
})

// const getMe = asyncHandler(async (req, res) => {
//     res.status(200).json(req.user)
// })

// //generate Jwt
const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn : '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}