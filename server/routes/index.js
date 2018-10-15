//
//
//

const express = require('express');
const router = express.Router();

const db = require('db');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index2', {
    title: 'timing',
    version: global.init.version
  });

  console.log("get /");
});

router.post('/', function(req, res, next) {

  var timing = {};
  if (req.body.title) {
    timing.title = req.body.title;
  }

  new db.time(timing).save(function(err, data) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.redirect('/timing/' + data._id);
      console.log(" * someone make a new route -> " + data._id);
      if (data.title) {
        console.log(" title -> " + data.title);
      }
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
      var members = [];

      if (data && data.members) {
        data.members.forEach(function(member) {

          if (member.name && member.name != '') {
            members.push(member.name);
          }
          member.times.forEach(function(time) {
            names[time] = names[time] || [];
            names[time].push(member.name);
          });
        });
      };

      var max_people = -1;

      for (key in names) {
        if (names[key].length > max_people)
          max_people = names[key].length;
      }


      res.render('table2', {
        names: names,
        title: data.title,
        max_people: max_people,
        members: members,
        version: global.init.version
      });
    }
  });
});

router.post('/timing/:_id', function(req, res, next) {



  var _id = req.params._id;

  console.log("someone post time to -> /timing/" + _id);

  var d = req.body;

  var user = {};

  user.name = d.name || 'ناشناس';
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
