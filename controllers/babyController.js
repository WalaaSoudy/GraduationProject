const Baby = require('../models/babyModel');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');

exports.getallbabies = asyncHandler(async (req, res, next) => {
    const babies = await Baby.find();
    res.status(200).json({
        success: true,
        data: babies
    });
});

exports.getbaby = asyncHandler(async (req, res, next) => {
    const baby = await Baby.findById(req.params.id);
    if (!baby) {
        return next(new ApiError('Baby not found', 404));
    }
    res.status(200).json({
        success: true,
        data: baby
    });
});

exports.createbaby = asyncHandler(async (req, res, next) => {
    const { name, birthdate, gender, address, email, password } = req.body;
    const baby = await Baby.create({
        name,
        birthdate,
        gender,
        address,
        email,
        password
    });
    
    res.status(201).json({
        success: true,
        data: baby
    });
});


exports.updatebaby = asyncHandler(async (req, res, next) => {
    const baby = await Baby.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!baby) {
        return next(new ApiError('Baby not found', 404));
    }
    res.status(200).json({
        success: true,
        data: baby
    });
});

exports.deletebaby = asyncHandler(async (req, res, next) => {

    const baby = await Baby.findByIdAndDelete(req.params.id);
    if (!baby) {
        return next(new ApiError('Baby not found', 404));
    }
    res.status(200).json({
        success: true,
        data: {}
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ApiError('Please provide email and password', 400));
    }
    const baby = await Baby.findOne({ email }).select('+password');
    if (!baby || !(await baby.matchPassword(password))) {
        return next(new ApiError('Invalid credentials', 401));
    }
    res.status(200).json({
        success: true,
        data: baby
    });
});