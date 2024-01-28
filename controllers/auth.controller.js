const User = require('../models/user.model');
const asyncErrorHandler = require('../utils/async.error.handler');
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/custom.error');
const util = require('util');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
//const Apifeatures = require('../utils/api.features');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES
  });
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = await User.create(req.body);

    /* Despues de crear el usuario puede loguearse a travez de jwt */
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: { user: newUser }
    });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Verificar si el email y password vienen en req.body
  if(!email || !password) {
    const error = new CustomError('Please provide email ID & password for login in!', 400);
    return next(error);
  }

  // Verificar que el correo exista en la db
  const user = await User.findOne({ email }).select('+password');

  // Veririficar si las contraseñas coinciden
  let isMatch = false;
  if (user) isMatch = await user.comparePassInDb(password, user.password);

  if (!user || !isMatch) {
    const error = new CustomError('Incorrect Email or Password!', 400);
    return next(error);
  }

  const token = signToken(user._id);

  res.status(200).json({
      status: 'success',
      token
  });
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  // 1. Read the tpken & check if it exist
  const testToken = req.headers.authorization;
  let token;

  if (testToken && testToken.startsWith('Bearer'))  {
    token = testToken.split(' ')[1];
  }

  if (!token) {
    next(new CustomError('You are not logged in!', 401));
  }

  // 2. validate the token
  const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

  // 3. if the user exists
  const user = await User.findById(decodedToken.id);

  if (!user) {
    next(new CustomError('The user with the given token does not exist!', 401));
  }

  // 4. if the user changed password after was the token issued
  const isPassChanged =  await user.isPassChanged(decodedToken.iat);
  if (isPassChanged) {
    
    return next(new CustomError('The password has been changed recently. Please login again!', 401));
  }

  // 5. Allow user to access route
  req.user = user;
  next();
});

exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      
      next(new CustomError('You do not have permission to perform this action!', 403));
    }

    next();
  }
}

// Example for multiples roles
/* exports.restrict = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      
      next(new CustomError('You do not have permission to perform this action!', 403));
    }

    next();
  }
} */
  
exports.forgotPassword = async (req, res, next) => {
  // 1. get user based on pested email
  const user = await User.findOne({
    email: req.body.email
  });

  if (!user) {
    next(new CustomError('We could not find the user with given email!', 404));
  }

  // 2. generate a random reset token 
  const resetToken = await user.createResetPassToken();

  await user.save({validateBeforeSave: false});

  // 3. send the token back to the user mail
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  
  const message = `We have recieved a password reser request. Please use the below link to reset your password.\n\n ${resetUrl} \n\n This reset password link will be valid only for 10 minutes.`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password change request recieved',
      message: message
    });

    res.status(200).json({
      status: 'success',
      message: 'password reset link send to the user mail.'
    });

    //next();
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    user.save({ validateBeforeSave: false });
    
    //console.log(error);
    
    return next(new CustomError('There was an error sending reset email. Please try again later!', 500));

    //return error;
  }
}

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  // 1. If rhe user exist wih the given token & token has not expired
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex');

  //const token = req.params.token;
  console.log('--------token--------');
  console.log(token);

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpire: {
      $gt: Date.now()
    }
  });

  if (!user) {
    return next(new CustomError('Token is invalid or has expired!', 400));
  }

  // 2. Reseting the user password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  user.passwordChangedAt = Date.now();

  user.save();

  // 3. login the user
  const loginToken = signToken(user._id);

  res.status(200).json({
      status: 'success',
      token: loginToken
  });
});

