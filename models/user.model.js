const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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

//Creando el modelo a partir del esquema
const User = mongoose.model('User', userSchema);

module.exports = User;