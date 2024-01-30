const express = require('express')
const route = express.Router()

const {getalldoctors, getdoctor, createdoctor, updatedoctor, login} = require('../controllers/DoctorController')

route.get('/', getalldoctors)
route.get('/:id', getdoctor)
route.post('/', createdoctor)
route.put('/:id', updatedoctor)
route.post('/login', login)



module.exports = route