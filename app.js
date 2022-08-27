const express = require('express');
const app = express();
const session =  require('express-session');
const passport = require('passport')
const utils = require('./utils');

const db = require('./db/index');



app.set("trust proxy", 1);
const PORT = process.env.PORT || 4001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

require("./config/passport");


app.use(session({
    secret: 'yes',
    cookie: {maxAge: 1000 * 60 * 5 },    //* 60 * 60 * 24
    saveUninitialized: false,
    resave: false,
    sameSite: 'none',
    secure: true,
  }))

app.use(passport.initialize());
app.use(passport.session());


//Routes


app.use(require('./routes/RouterIndex'));

app.get('/', async (req,res, next) => {
    
    let userDis;

    

    (req.user)? userDis = req.session.data.username :  userDis = 'Guest'; 

    try{

    let itemsFetch = await db.getAllItems();

    items = utils.defineImage(itemsFetch);
        

    const data = {items: items, userDis: userDis};

    res.render('home', { data });
    }catch(err){
        console.log(err)
    }
    
})

app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
})