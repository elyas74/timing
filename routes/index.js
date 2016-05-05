var express = require('express');
var router = express.Router();

var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'timing'
    });
});

router.post('/', function(req, res, next) {

    var title = req.body.title || "";

    new db.time({
        title: title
    }).save(function(err, data) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("someone make a new route -> " + data._id);
            res.redirect('/timing/' + data._id);
        }
    });
});

router.get('/timing/:_id', function(req, res, next) {

    var _id = req.params._id;
    console.log("someone watching -> /timing/" + _id);

    db.time.findOne({
        _id: _id
    }).lean().exec(function(err, data) {
        if (err) {
            console.log(err);
            res.send(err);
        } else if (data) {

            var names = {};

            if (data && data.members) {
                data.members.forEach(function(member) {
                    member.times.forEach(function(time) {
                        names[time] = names[time] || [];
                        names[time].push(member.name);
                    });
                });
            };

            var max_people = 0;

            for (key in names) {
                if (names[key].length > max_people)
                    max_people = names[key].length;
            }


            res.render('table', {
                names: names,
                title: data.title,
                max_people: max_people
            });
        }
    });
});

router.post('/timing/:_id', function(req, res, next) {



    var _id = req.params._id;

    console.log("someone post time to -> /timing/" + _id);

    var d = req.body;

    var user = {};

    user.name = d.name || 'نا شناس';
    user.times = [];


    for (var key in d) {
        if (d[key] == 'on') {
            user.times.push(key);
        }
    }

    db.time.findOne({
        _id: _id
    }).exec(function(err, data) {

        data.members.push(user);

        data.save(function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.redirect('/timing/' + data._id);
            }
        });
    });
});


module.exports = router;
