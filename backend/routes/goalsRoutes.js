const express = require('express')
const router = express.Router()
const {getGoal,setGoal,updateGoal,deleteGoal} = require('../controllers/goalsController')

const {protect} = require('../middleware/authMiddleware')

router.route('/').get(getGoal).post(setGoal)
router.route('/:id').delete(protect,deleteGoal).put(protect,updateGoal)

module.exports = router