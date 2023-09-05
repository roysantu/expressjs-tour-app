const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  const token = generateToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    tour: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (
    !email ||
    !password
    // ||
    // typeof email === 'string' ||
    // typeof password === 'string'
  ) {
    return next(new AppError('valid email and password required!', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  // const correct = user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = generateToken(user._id);
  console.log(user)
  console.log(token)
  res.status(200).json({
    status: 'success',
    token,
  });
});
