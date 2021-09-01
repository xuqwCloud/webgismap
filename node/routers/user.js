var express = require('express');
var pg = require('pg');
var router = express.Router();

var pgConfig = "postgres://postgres:webgis@localhost:5432/webgis";

router.get('/get', function (req, res) {
    var client = new pg.Client(pgConfig);
    client.connect(function (isErr) {
        if (isErr) {
            console.log('connect error:' + isErr.message);
            client.end();
            return;
        }
        client.query('SELECT * FROM "user" WHERE name = $1', ['admin'], function (isErr, rst) {
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
        })
    })
});

router.post('/insert', function (req, res) {
    res.send('user insert');
});

module.exports = router;