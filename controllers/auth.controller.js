const User = require('../models/user.model');
const asyncErrorHandler = require('../utils/async.error.handler');
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/custom.error');
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
  

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  
  const features = new Apifeatures(User.find(), req.query)
                      .filter()
                      .sort()
                      .limit()
                      .paginate();
  
  let Users = await features.query;
  
  res.status(200).json({
    status: 'success',
    length: Users.length,
    data: { Users }
  });
});

exports.getUser = asyncErrorHandler(async (req, res, next) => {
  const User = await User.findById(req.params.id);

  if(User) {
    res.status(200).json({
      status: 'success',
      data: { User }
    });
  } else {
    const error = new CustomError('User with that ID is not found', 404);
    next(error);
  }

});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

  if(updateUser) {
    res.status(200).json({
      status: 'success',
      data: { updateUser }
    });
  } else {
    const error = new CustomError('User with that ID is not found', 404);
    next(error);
  }
  
});

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const deleteUser = await User.findByIdAndDelete(req.params.id);

  if(deleteUser) {
    res.status(200).json({
      status: 'success',
      data: { deleteUser }
    });
  } else {
    const error = new CustomError('User with that ID is not found', 404);
    next(error);
  }
});
