const usersRepository = require('./repositories/users.js');
const express= require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const app = express();

app.use( bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ['sd9fjn78h']
}));

app.get('/signup', (req, res)=>{
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email"/>
                <input name="password" placeholder="password"/>
                <input name="passwordConfirmation" placeholder="passwordConfirmation"/>
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

app.post('/signup', async(req, res)=>{
    const {email, password ,passwordConfirmation}=req.body;

    const existingUser= await usersRepository.getOneBy({email: email});
    if(existingUser){
        return res.send('Entered email is already in use');
    }
    if(password!==passwordConfirmation){
        return res.send('Passwords do not match');
    }

    //creating a user in usersRepository to represent person
    const user = await usersRepository.create({email, password});

    //store the id of that user inside the users cookie
    req.session.userId = user.id;

    res.send('Your account was created');
});

app.get('/signout', (req, res)=>{
    req.session=null;
    res.send('You are logged out');
});

app.get('/signin', (req, res)=>{
    res.send(`
    <div>
    <form method="POST">
        <input name="email" placeholder="email"/>
        <input name="password" placeholder="password"/>
        <button>Sign In</button>
    </form>
</div>
    `);
});
app.post('/signin', async(req, res)=>{
    const {email, password}=req.body;

    const user= await usersRepository.getOneBy({email: email});
    if(!user){
        return res.send('Entered email is not in use');
    }

    if(password!==user.password){
        return res.send('Invalid password');
    }

    req.session.userId = user.id;
    res.send('You are signed in');

});

app.listen(3000, ()=>{
    console.log('Listening');
});