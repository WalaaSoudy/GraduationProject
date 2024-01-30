const Doctor = require('../models/DoctorModel');
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getalldoctors=asyncHandler(async(req,res,next)=>{
    const doctors = await Doctor.find();
    res.status(200).json({
        success:true,
        data:doctors
    })
}
)


exports.getdoctor=asyncHandler(async(req,res,next)=>{
    const doctor = await Doctor.findById(req.params.id);
    if(!doctor){
        return next(new ApiError('Doctor not found',404));
    }
    res.status(200).json({
        success:true,
        data:doctor
    })
})


exports.createdoctor=asyncHandler(async(req,res,next)=>{
    const {name,email,password,phone,specialization,degree,workPlace,description}=req.body;
    const doctor = await Doctor.create({
        name,
        email,
        password,
        phone,
        specialization,
        degree,
        workPlace,
        description
    });

