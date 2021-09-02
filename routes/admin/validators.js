const { check } = require('express-validator');
const usersRepository = require('../../repositories/users');

module.exports = {
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async email => {
      const existingUser = await usersRepository.getOneBy({ email });
      if (existingUser) {
        throw new Error('Email in use');
      }
    }),

  requirePassword: check('password')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),

  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom(async (passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match');
      }
    }),

    requireValidEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async(email)=>{
        const user= await usersRepository.getOneBy({email});
        if(!user){
            throw new Error('Entered email is not in use');
        }
    }),

    requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, {req})=>{
        const user = await usersRepository.getOneBy({email: req.body.email});
        if(!user){
            throw new Error('Entered email is not in use');
        }
        const validPassword = await usersRepository.comparePasswords(
            user.password,
            password
        );
        if(!validPassword){
            throw new Error('Invalid password');
        }
    })

};