const express = require('express')
const route = express.Router()
const verifyToken = require('../middlewares/verifyToken')

const {getAllDoctors, getSpecificDoctor, register, updateDoctor, deleteDoctor, login} = require('../controllers/DoctorController')
route.route('/').get(getAllDoctors)
route.route('/').post(register)
route.route('/:id').get(getSpecificDoctor).put(updateDoctor)
route.route('/:id').delete(deleteDoctor)
route.route('/login').post(login)

module.exports = route