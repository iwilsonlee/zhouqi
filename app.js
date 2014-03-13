
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var ejs = require('ejs');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.engine('.html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser('wilsonlee')); //用于分析和处理req.cookies的cookie数据(我们知道session会利用cookie进行通信保持的)。
app.use(express.session({
    secret: "wilsonlee",
    cookie: { maxAge: 1800000 }
}));
app.use(function(req, res, next){
    res.locals.member = req.session.member;
    //res.locals.member_name = req.session.name;
    //res.locals.user_code = req.session.user_code;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if(err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
    next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function authentication(req, res, next){
    if(!req.session.member){
        req.session.error = '请先登录';
        return res.redirect('/member/login');
    }
    next();
}

function notAuthentication(req, res, next){
    if(req.session.member){
        req.session.error = '已登录';
        return res.redirect('/member/index');
    }
    next();
}

function authRecommendNo(req, res, next){
    if(!req.session.user_code){
        req.session.error = '请先输入销售顾问编号';
        return res.redirect('/');
    }
    next();
}

app.get('/', routes.index);
app.get('/member/login', notAuthentication);
app.get('/member/login', routes.member_login);
app.post('/member/login', routes.member_doLogin);
app.get('/member/logout', authentication);
app.get('/member/logout', routes.member_logout);
app.get('/member/index', authentication);
app.get('/member/index', routes.member_index);
app.get('/captcha',routes.captcha);
app.get('/barcode',routes.barcode);

app.get('/register/:recommendNo',authRecommendNo);
app.get('/register/:recommendNo',routes.register);
app.post('/register',routes.register_do);
app.post('/home',routes.home_do);
app.get('/home',routes.home);
//app.get('/home/:recommendNo',authRecommendNo);
app.get('/home/:recommendNo',routes.home);
app.get('/helpEmail',routes.helpEmail);
app.get('/error', routes.error);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
