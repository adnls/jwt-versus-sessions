const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
var uuid = require('uuid/v1');
const cookieParser = require('cookie-parser');
const app = express();
//const session = require('express-session');

const server = http.createServer(app);

const ADMIN = 'admin';
const ADMIN_PASSWORD = 'password';
const SECRET = 'adnls';

var cookieXtractor = req => {

  var token = null;
  if (req && req.cookies) token = req.cookies.token;
  return token;
};

app.use(cookieParser()); //give access to cookies
app.use(bodyParser.urlencoded({ extended: false })); //let read body
app.use(bodyParser.json()); //as a json

//local strategy for login based on db call verif
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, done) => {
  if (username === ADMIN && password === ADMIN_PASSWORD) {
  
  const randId = uuid(); //ad a custom prop key that the client store in browser and retrieve in request header
  return done(null, { 
            token:jwt.sign({ sub: username, jwtKey:randId }, SECRET, {expiresIn: 86400 }), 
            jwtKey:randId
          }
        );
  }
  return done(null, false);
}));

//stratgy verify iftoken in the cookies
//TODO verify expiration, verify headers key jwtKey exposed in cors

passport.use(new JWTStrategy({
  jwtFromRequest: cookieXtractor,
  secretOrKey   : SECRET,
  passReqToCallback:true
}, (req, jwtPayload, done) => {
  //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      if (jwtPayload.jwtKey === req.headers['x-xsrf-token']) {
        return done(null, true);
      } else {
        return done(null, false);
      }
    })
  );

app.post(
  '/api/login',
  passport.authenticate('local', {session:false}),
  (req, res) => {
    res.cookie('token', req.user.token, {httpOnly:true});
    res.status(200).send({
      jwtKey:req.user.jwtKey
    });
  },
);

app.get(
  '/api/test',
    passport.authorize('jwt', {session:false}), (req, res) => {
    res.status(200).send({foo:'abc', bar:123});
  }
)

const socketIO = require('socket.io');
const io = socketIO(server, {
  serveClient: false, 
  cookie:false
});
var cookie = require('cookie');

const JWTsocketIOStrategy = (socket, next) => {
  
  const handshakeData = socket.request;
  const requestCookie = cookie.parse(handshakeData.headers.cookie || '');
  const payload = requestCookie.token? jwt.verify(requestCookie.token, SECRET) : '';
  const csrfOk = handshakeData.headers['x-xsrf-token'] === payload.jwtKey;
  const authOk = payload && csrfOk; 
 
  if (authOk) {
    socket.handshakeRes = 'ok';
  }
  else {
    socket.handshakeRes = 'nop';
  }

  next();
}

io.use((socket, next) => {
  JWTsocketIOStrategy(socket, next);
  }
);

io.on('connection', socket => {
  
  socket.emit('auth', socket.handshakeRes);

  if (socket.handshakeRes !== 'ok') 
    socket.disconnect();
  else console.log('connection');

  socket.on('disconnect', () => {
      console.log('disconnection');
  })
});

const port = 8080;
server.listen(port, () => console.log('listening on localhost:' + port));