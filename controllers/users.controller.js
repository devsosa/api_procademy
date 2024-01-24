const User = require('../models/user.model');
const Apifeatures = require('../utils/api.features');
const asyncErrorHandler = require('../utils/async.error.handler');
const CustomError = require('../utils/custom.error');


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

exports.createUser = asyncErrorHandler(async (req, res, next) => {
  const User = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { User }
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
