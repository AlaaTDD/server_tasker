const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');
const otpGenrate = require("otp-generator");

const factory = require('./handlerfactory');
const ApiError = require('../utils/apiError');
const { uploadsingleImage } = require('../middelwares/uploadImageMiddelWare');
const createToken = require('../utils/createToken');
const User = require('../models/usermodel');
const otpModel = require('../models/otpmodel');

// Upload single image
exports.uploadUserImage = uploadsingleImage('profileImg');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();
});

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = factory.getOne(User);

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private/Admin
exports.createUser = factory.createOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
exports.sendOTP = asyncHandler(async (req, res, next) => {
  const phone = req.body.phone;
  const user = await User.findOne({ phone: phone, });
  console.log(user);
  if (!user) {
    return next(new ApiError("User not registered!", 400));
  }
  const OTP = otpGenrate.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
    alphabets: false,
    lowerCaseAlphabets: false,
  });
  console.log(OTP);
  const otp = await otpModel.create({
    number: phone,
    otp: OTP
  });
  otp.otp = await bcrypt.hash(otp.otp, 12);
  const results = await otp.save();
  const text = `otp is ${OTP}`;
  const from = "AlaaTaha";
  const to = phone;
  //await  vonage.sms.send({to, from, text});

  res.status(200).json({ otp: otp, OTP });
});
exports.verifyOtp = asyncHandler(async (req, res, next) => {
  const otpp = await otpModel.findOne({
    number: req.body.number,
  });

  if (!otpp || !(await bcrypt.compare(req.body.otp, otpp.otp))) {
    return next(new ApiError('Incorrect email or password', 401));
  }
  console.log(req.body.number);
  console.log(req.body.otp);
  console.log(otpp);
  const user = await User.findOne({ phone: req.body.number });

  const token = createToken(user._id);

  res.status(200).json({ otp: user, token });
});
exports.changeUserPassword = asyncHandler(async (req, res, next) => {


  const document = await User.findOneAndUpdate(
    { phone: req.body.phone },
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.body.phone}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = factory.deleteOne(User);

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});