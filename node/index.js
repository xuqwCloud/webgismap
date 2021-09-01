var express = require('express');
var app = express();
var home = require('./routers/home');
var user = require('./routers/user');

app.use('/', home);
app.use('/user', user);

app.listen(3001);