const express = require('express')
const route = express.Router()
const verifyToken = require('../middlewares/verifyToken')

const{getAllBabies,getSpecificBaby,register,updateBaby,deleteBaby,login}=require('../controllers/BabyController')

route.route('/').get(getAllBabies)
route.route('/').post(register)
route.route('/:id').get(getSpecificBaby).put(updateBaby)
route.route('/:id').delete(deleteBaby)
route.route('/login').post(login)

module.exports = route