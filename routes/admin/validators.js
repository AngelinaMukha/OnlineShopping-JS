const {check} =require('express-validator');
const usersRepository =require('../../repositories/users');

module.exports = {
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async (email)=>{
            const existingUser= await usersRepository.getOneBy({email: email});
            if(existingUser){
                throw new Error('Entered email is already in use');
            }
        }),
        
    requirePassword: check('password')
    .trim()
    .isLength({min:8, max: 15})
    .withMessage('Must be between 8 and 15 characters'),

    requirePasswordConfirmation:check('passwordConfirmation')
    .trim()
    .isLength({min:8, max: 15})
    .withMessage('Must be between 8 and 15 characters')
    .custom((passwordConfirmation, { req }) => {
        if (passwordConfirmation !== req.body.password) {
          throw new Error('Passwords do not match');
        }
      })
};