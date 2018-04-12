const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const app = express();
const server = http.createServer(app);
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var db = require('./dbService.js')('mysql://root:123azerty@127.0.0.1:3306/session_test');
const SECRET = '123azerty';

var sessionStoreOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: SECRET,
    database: 'session_test'
};
 
var sessionStore = new MySQLStore(sessionStoreOptions);

passport.serializeUser(function(user, done) {
    done(null, user.id);
  }
);

// used to deserialize the user
passport.deserializeUser((id, done) => {
    db.findOneUser(id)
    .then(user => done(null, user))
    .catch(err => console.log(err));
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
        
        db.dbaObjects.userInfo.findOne({where:{email:email}})
        .then(user => {
            if (user)
                done(null, user);
            else done(null, false);
        })
        .catch(err => done(err));
  }));


const verifySession = () => {
    return (req, res, next) => {
            if (req.isAuthenticated()) {
                return next();
            }
            res.status(401).send('Access denied');
        }
};

app.use(cookieParser()); //give access to cookies
app.use(bodyParser.urlencoded({ extended: false })); //let read body
app.use(bodyParser.json()); //as a json
app.use(session({
    key: 'session_id',
    secret: SECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.post(
    '/api/login',
        passport.authenticate('local'),
        (req, res) => {
            console.log(req.user.username);
            res.status(200).send('authOk');
        },
);

app.get(
    '/api/test',
        verifySession(),
        (req, res) => {
        res.status(200).send({foo:'abc', bar:123});
    }
)

db.defineDbaObject('userInfo');

db.sync({force:true})
.then(()=> {
    db.insertOne('userInfo', {
        firstname: 'ad',
        lastname: 'nls',
        username: 'adnls',
        about: 'nothing',
        email: 'david.ayache90@gmail.com',
        password: '123azerty',
    })
    .then(()=> {
        db.dbaObjects.userInfo.findOne({ where:{ email:'david.ayache90@gmail.com' } })
        .then(() => {
            const port = 5000;
            server.listen(port, () => console.log('server listen on localhost:' + port));                
        })
    })
})
.catch(err=>console.log(err));
