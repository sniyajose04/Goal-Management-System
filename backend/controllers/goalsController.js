const asyncHandler = require('express-async-handler')
const Goal = require('../model/goalModel')
const User = require('../model/userModel')

// //@desc Get goals
// //@route GET/api/goals
// //@access Private

const getGoal = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json(goals)
})

// // const getGoal = asyncHandler(async (req, res) => {
// //     const user = await User.findById(req.user.id);
// //     if (!user) {
// //         res.status(401);
// //         throw new Error('User not found');
// //     }
// //     const goals = await Goal.find({ user: req.user.id });
// //     res.status(200).json(goals);
// // });

// //@desc set goals
// //@route POST/api/goals
// //@access Private
const setGoal = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('Please add a text field')
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goal)
})

// // const setGoal = asyncHandler(async(req,res)=>{
// //     if(!req.body.text){
// //         res.status(400)
// //         throw new Error('please add a text field')
// //     }
// //     const goal = await Goal.create({
// //         text:req.body.text,
// //         user:req.user.id
// //     })
// //     res.status(201).json(goal)
// // })

// //@desc Update goals
// //@route PUT/api/goals/:id
// //@access Private

const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //make sure the logged in user matches the goal user
    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedGoal)
})

// // const updateGoal = asyncHandler(async(req,res)=>{
// //     const goal = await Goal.findById(req.params.id)
// //     if(!goal){
// //         res.status(400)
// //         throw new Error('Goal not found')
// //     }

// //     //check for user
// //     if(!req.user){
// //         res.status(401)
// //         throw new Error('User not found')
// //     }

// //     //make sure the logged in user matches the goal user
// //     if(goal.user.toString()!==req.user.id){
// //         res.status(401)
// //         throw new Error('User not authorized')
// //     }

// //     const updatedGoal = await Goal.findByIdAndUpdate(req.params.id,req.body,{
// //         new:true,
// //     })
// //     res.status(200).json(updatedGoal)
// // })

// //@desc Delete goals
// //@route DELETE/api/goals/:id
// //@access Private

const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }
    const user = await User.findById(req.user.id)
      //check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    if(goal.user.toString()!==user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    await goal.deleteOne()
    res.status(200).json({ id: req.params.id })
})

// // const deleteGoal = asyncHandler(async(req,res)=>{
// //     const goal = await Goal.findById(req.params.id)
// //     if(!goal){
// //         res.status(400)
// //         throw new Error('Goal not found')
// //     }

// //     //check for user
// //     if(!req.user){
// //         res.status(401)
// //         throw new Error('User not found')
// //     }

// //     if(goal.user.toString()!==req.user.id){
// //         res.status(401)
// //         throw new Error('User not authorized')
// //     }

// //     await goal.remove()
// //     res.status(200).json({id:req.params.id})
// // })

module.exports = {
    getGoal,
    setGoal,
    updateGoal,
    deleteGoal
}