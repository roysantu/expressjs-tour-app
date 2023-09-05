const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();

  res.status(200).json({
    status: 'success',

    results: {
      count: allUsers.length,
      users: allUsers,
    },
  });
  });
  
  exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'not implemented'
    })
  };
  
  exports.getUserById = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'not implemented'
    })
  };
  
  exports.updateUserById = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'not implemented'
    })
  };
  
  exports.deleteUserById = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'not implemented'
    })
  };