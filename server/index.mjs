// import
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {check, validationResult} from 'express-validator';
import {getRound, getUserGames, saveGame, validateAnswer} from './game-dao.mjs';
import { getUser, getUserById } from './user-dao.mjs';


import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

/* ROUTES */

// GET /api/round
app.get('/api/round', (request, response) => {
  const { first, second } = request.query;
  const round = getRound(first, second).then((round) => {
    if (round) {
      //delete round.answer1;
      //delete round.answer2;
      response.json(round);
    } else {
      response.status(500).end();
    }
  });
});

// POST /api/game
app.post('/api/game', isLoggedIn, (request, response) => {
  const game = request.body;
  if (game) { 
    saveGame(game.score, request.user.id, game.rounds).then(() => {
      response.status(201).end();
    });
  }
});

//GET /api/games
app.get('/api/games', isLoggedIn, (req, response) => {
  getUserGames(req.user.id).then((games) => {
    if (games) {
      response.json(games);
    } else {
      response.status(422).end();
    }
  });
 
});

//POST /api/validate
app.post('/api/validate', (req, res)=>{
  validateAnswer(req.body.imageId, req.body.answer).then((ok)=>{
    res.json(ok)
  }).catch(()=>{
    res.status(422).end();
  });
})

// DELETE /api/game
app.delete('/api/game',isLoggedIn, (_, response) => {
  reset().then(() => {
    response.status(204).end();
  });
});

// POST /api/sessions -- NEW
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current -- NEW
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current -- NEW
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});



// far partire il server
app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });