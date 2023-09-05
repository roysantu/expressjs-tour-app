const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: false,
    trim: true,
    maxLength: [40, 'Expected less or equal 40 char'],
    minLength: [3, 'Expected more or equal 3 char'],
    validate: {
      validator: function (val) {
        return validator.isAlpha(val, 'en-US', { ignore: ' ' });
      },
      message: 'User name contains characters',
    },
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email format'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minLength: [8, 'Expected more or equal 8 char'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'password is required'],
    select: false,
    // minLength: [8, 'Expected more or equal 8 char'],
    // Only works in CREATE and SAVE
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Not same password',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // encrypt password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
