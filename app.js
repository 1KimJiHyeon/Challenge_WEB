const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
// 1. import passport module
const passport = require('passport');

dotenv.config();
// import routers
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const { sequelize } = require('./models');

// 2. import passport 설정 모듈 (./passport/index.js)
const passportConfig = require('./passport');

const app = express();

// mongodb setup
var mongoose = require('mongoose');
var promise = mongoose.connect('mongodb://localhost/mydb', {
  useNewUrlParser: true    //add it
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('connected successfully');
});

// 3. passport 설정 함수 실행
passportConfig();
app.set('port', process.env.PORT || 8001);

app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  autoescape: true,
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
// 4. passport 초기화 미들웨어 실행 : req 객체에 passport 정보 저장
app.use(passport.initialize());
// 5. passport 세션 미들웨어 실행 : req.session 객체에 passport 정보 저장
// req.session이 생성되는 express-session 미들웨어 뒤에 연결해야
app.use(passport.session());

// 요청 경로에 따라 router 실행
app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);

// 오류 처리: 요청 경로가 없을 경우

app.use('/', pageRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});