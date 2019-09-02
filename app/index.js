const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const logger = require('morgan');
const pe = require('parse-error');
const Sentry = require('@sentry/node');

const io = require('socket.io');

const app = express();
const server = require('http').Server(app);
const CONFIG = require('./config');
const authService = require('./services/auth.service');
const { ReE, ReS, to } = require('./services/util.service');
const db = require('./models');
const UsuarioController = require('./controllers/UsuarioController');


// The request handler must be the first middleware on the app
Sentry.init(CONFIG.Sentry);

app.use(Sentry.Handlers.requestHandler());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Conectado ao banco de dados SQL:', CONFIG.DB.name);
  })
  .catch((err) => {
    console.log('Não é possível conectar-se ao banco de dados SQL:', CONFIG.DB.name);
    console.log(err);
  });

app.use(cors());

const jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken();
const secretOrKey = CONFIG.JWT.secretPublic;

const strategy = new passportJWT.Strategy({ jwtFromRequest, secretOrKey }, async (token, next) => {
  console.log(token);
  const [err, usuario] = await to(UsuarioController.usuarioById(token.id, token.empresa));
  if (err) return next(err, false);

  if (usuario) {
    next(null, usuario);
  } else {
    next(null, false);
  }
});

// use the strategy
passport.use(strategy);

app.use((req, res, next) => {
  req.io = io;

  next();
});

app.post('/login', async (req, res) => {
  const { body } = req;

  const [err, usuario] = await to(authService.authentication(body));
  if (err) return ReE(res, err, 200);

  return ReS(res, { token: usuario.getJWT(body.empresa), usuario });
});

// app.use('/public', require('./routes/public.routes'));
app.use('/private', passport.authenticate('jwt', { session: false }), require('./routes/private.routes'));
app.use('/public', require('./routes/private.routes'));


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.message = 'Not Found';
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use((err, req, res, next) => {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(`${res.sentry}\n`);
});

process.on('unhandledRejection', (error) => {
  console.error('Uncaught Error', pe(error));
});

const port = CONFIG.port || 3000;

server.listen(CONFIG.port, () => {
  console.log(`Servidor em execução na porta :${port}`);
});
