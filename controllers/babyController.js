const Baby = require('../models/babyModel');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllBabies = asyncHandler(async (req, res, next) => {
    const limit = req.params.limit
    const page = req.params.page
    const skip = (page - 1) * limit
    const babies = await Baby.find({},{"__v":false,'password':false}).limit(limit).skip(skip);
    if (!babies) {
        return next(new ApiError(`No Baby found`, 404));
    }
    res.status(200).json({
        status: 'success',
        data: babies
    });
});

exports.getSpecificBaby = asyncHandler(async (req, res, next) => {
    const baby = await Baby.findById(req.params.id);
    if (!baby) {
        return next(new ApiError(`No baby found with id ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: baby
    });
});

exports.register = asyncHandler(async (req, res, next) => {
    const { name, birthdate, gender, address, email, password } = req.body;
    const salt = await bcrypt.genSalt(7);
    const hashedPassword = await bcrypt.hash(password, salt);
    const baby = new Baby({name, birthdate, gender, address, email, password: hashedPassword});
    const token = jwt.sign({email: baby.email, id :baby._id}, process.env.JWT_SECRET);
    baby.token = token;

    await baby.save();
    res.status(201).json({
        status: 'success',
        data: baby
    });
});


exports.updateBaby = asyncHandler(async (req, res, next) => {
    const baby = await Baby.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!baby) {
        return next(new ApiError(`No baby found with id ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: baby
    });
});

exports.deleteBaby = asyncHandler(async (req, res, next) => {
    const baby = await Baby.findByIdAndDelete(req.params.id);
    if (!baby) {
        return next(new ApiError(`No baby found with id ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: "Baby is deleted successfully"
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    const baby = await Baby.findOne({email: email});
    if (!baby) {
        return next(new ApiError(`Invalid email or password`, 401));
    }
    const isMatch = await bcrypt.compare(password, baby.password);
    if (!isMatch) {
        return next(new ApiError(`Invalid email or password`, 401));
    }
    const token = jwt.sign({email: baby.email, id :baby._id}, process.env.JWT_SECRET);
    baby.token = token;
    await baby.save();

    res.status(200).json({
        status: 'success',
        data: baby
    });
    
});