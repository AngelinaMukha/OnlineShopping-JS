const express= require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRauter = require('./routes/admin/auth');

const app = express();

app.use(express.static('public'));
app.use( bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ['sd9fjn78h']
}));
app.use(authRauter);

app.listen(3000, ()=>{
    console.log('Listening');
});