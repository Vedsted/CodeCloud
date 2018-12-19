'use strict';

module.exports = {
    setGuid: setGuid,
    setTimestamp: setTimestamp
};

function setGuid(context, events, done) {
    context.vars.guid = guid();
    return done();
}

function setTimestamp(context, events, done) {
    context.vars.timestamp = timestamp();
    return done();
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function timestamp() {
    return Date.now();
}