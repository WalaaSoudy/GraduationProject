const Doctor = require('../models/DoctorModel');
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllDoctors = asyncHandler(async (req, res, next) => {
    const limit = req.params.limit
    const page = req.params.page
    const skip = (page - 1) * limit
    const doctor = await Doctor.find({},{"__v":false,'password':false}).limit(limit).skip(skip);
    if (!doctor) {
        return next(new ApiError(`No doctor found`, 404));
    }
    res.status(200).json({
        status: 'success',
        data: doctor
    });
});

exports.getSpecificDoctor = asyncHandler(async (req, res, next) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
        return next(new ApiError(`No doctor found with id ${req.params.id}`, 404));
    }
    res.status(200).json({
        status: 'success',
        data: doctor
    });
});

exports.register = asyncHandler(async (req, res, next) => {
    const {firstName, lastName, phone, specialization, degree, workPlace, description, email, password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const doctor = new Doctor({firstName, lastName, phone, specialization, degree, workPlace, description, email, password: hashedPassword});
    const token = jwt.sign({email: doctor.email, id: doctor._id}, process.env.JWT_SECRET);
    doctor.token = token;

    await doctor.save();
    res.status(201).json({
        status: 'success',
        data: doctor
    });
});

exports.updateDoctor = asyncHandler(async (req, res, next) => {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!doctor) {
        return next(new ApiError(`No doctor found with id ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: doctor
    });
});

exports.deleteDoctor = asyncHandler(async (req, res, next) => {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
        return next(new ApiError(`No doctor found with id ${req.params.id}`, 404));
    }
    res.status(200).json({
        status: 'success',
        data: "Doctor is deleted successfully"
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    const doctor = await Doctor.findOne({email: email});
    if (!doctor) {
        return next(new ApiError('Invalid email or password!', 401));
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
        return next(new ApiError('Invalid email or password!', 401));
    }
    const token = jwt.sign({email: doctor.email, id: doctor._id}, process.env.JWT_SECRET);
    doctor.token = token;
    await doctor.save();

    res.status(200).json({
        status: 'success',
        data: doctor
    });
});