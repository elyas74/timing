//

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var timing_schema = Schema({
    title: String,
    members: [{
        name: String,
        times: [
            Number
        ]
    }]
});

// return each schema a model for use in other part of app.
module.exports = (function() {
    var _return = {};

    _return.time = mongoose.model('time', timing_schema);

    return _return;
})();
