const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required field!'],
    unique: [true, 'The user name is unique!']
  },
  email: {
    type: String,
    required: [true, 'Email is required field!'],
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email.']
  },
  role: {
    type: String,
    // enum: ['user', 'admin', 'test1', 'test2'],
    enum: ['user', 'admin', 'test1', 'test2'],
    default: 'user'
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Password is required field!'],
    minlength: 8,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm password is required field!'],
    validate: {
        // this validator will only work for save() and create()
        validator: function (value) {
            return value == this.password;
        },
        message: "Password and Confirm Password does not match!"
    }
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },
  passwordResetTokenExpire: {
    type: Date
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// MIDDLEWARE MONGOOSE
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);

    //No queremos que se guarde en la db
    this.confirmPassword = undefined;

    next();
});

userSchema.methods.comparePassInDb = async function(pass, passDb) {

  return await bcrypt.compare(pass, passDb);
}

userSchema.methods.isPassChanged = async function(JWTTimestamp) {

  if (this.passwordChangedAt) {
    const passChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    console.log(passChangedTimestamp, JWTTimestamp);

    return JWTTimestamp < passChangedTimestamp;
  }
  return false;
}

userSchema.methods.createResetPassToken = async function(JWTTimestamp) {

  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;

  //console.log('resetToken ' + resetToken);
  console.log('passwordResetTokenExpire: ' + this.passwordResetTokenExpire);

  return resetToken;
}

//Creando el modelo a partir del esquema
const User = mongoose.model('User', userSchema);

module.exports = User;