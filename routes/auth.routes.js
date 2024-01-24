const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

/* router.route('/')
    .get(UsersController.getAllUsers)
    .post(UsersController.createUser);

router.route('/:id')
    .get(UsersController.getUser)
    .put(UsersController.updateUser)
    .delete(UsersController.deleteUser); */

module.exports= router;