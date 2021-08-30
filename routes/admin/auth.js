const express = require('express');
const {check, validationResult}= require('express-validator');

const usersRepository=require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {requireEmail, requirePassword, requirePasswordConfirmation} =require('./validators');

const router = express.Router();

router.get('/signup', (req, res)=>{
    res.send(signupTemplate({req}));
});

router.post('/signup', [
    requireEmail,
    requirePassword,
    requirePasswordConfirmation
],
async(req, res)=>{
    const errors = validationResult(req);
    console.log(errors);
    const {email, password ,passwordConfirmation}=req.body;

    //creating a user in usersRepository to represent person
    const user = await usersRepository.create({email, password});

    //store the id of that user inside the users cookie
    req.session.userId = user.id;

    res.send('Your account was created');
});

router.get('/signout', (req, res)=>{
    req.session=null;
    res.send('You are logged out');
});

router.get('/signin', (req, res)=>{
    res.send(signinTemplate({req}));
});

router.post('/signin', async(req, res)=>{
    const {email, password}=req.body;

    const user= await usersRepository.getOneBy({email: email});
    if(!user){
        return res.send('Entered email is not in use');
    }

    const validPassword = await usersRepository.comparePasswords(
        user.password,
        password
    );
    if(!validPassword){
        return res.send('Invalid password');
    }

    req.session.userId = user.id;
    res.send('You are signed in');

});

module.exports = router;