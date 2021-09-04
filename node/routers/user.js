var express = require('express');
var pg = require('pg');
var router = express.Router();

var pgConfig = "postgres://postgres:webgis@localhost:5432/webgis";

//获取用户信息接口
router.get('/get', function (req, res) {
    var name = req.query.name;
    var client = new pg.Client(pgConfig);
    client.connect(function (isErr) {
        if (isErr) {
            console.log('connect error:' + isErr.message);
            client.end();
            return;
        };
        client.query('SELECT * FROM "user" WHERE name = $1', [name], function (isErr, rst) {
            if (isErr) {
                console.log('query error:' + isErr.message);
                res.send({
                    status: 'fail',
                    msg: 'query error'
                });
            } else {
                console.log('query success, data is: ' + rst);
                res.send({
                    status: 'success',
                    data: rst.rows
                });
            }
            client.end();
        });
    });
});

//用户注册接口
router.post('/insert', function (req, res) {
    var name = req.body.name;
    var psd = req.body.psd;
    var phone = req.body.phone;
    var email = req.body.email;
    var client = new pg.Client(pgConfig);
    client.connect(function (isErr) {
        if (isErr) {
            console.log('connect error:' + isErr.message);
            client.end();
            return;
        };
        client.query('INSERT INTO "user" (name, psd, phone, email) VALUES ($1, $2, $3, $4);', [name, psd, phone, email], function (isErr, rst) {
            if (isErr) {
                console.log('query error:' + isErr.message);
                res.send({
                    status: 'fail',
                    msg: 'insert error'
                });
            } else {
                console.log('insert success, data is: ' + rst);
                res.send({
                    status: 'success',
                    data: []
                });
            }
            client.end();
        });
    });
});

module.exports = router;