var express = require('express');
var app = express();

app.get('/test', function (req, res) {
    res.send('hello world 1');
});

app.listen(3001);