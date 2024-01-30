const express = require('express')
const route = express.Router()
const{getAllBabies,getSpecificBaby,register,updateBaby,deleteBaby}=require('../controllers/babyController')
route.route('/').post(register)
route.route('/:id').get(getSpecificBaby).put(updateBaby).delete(deleteBaby)
module.exports = route