'use strict';

var request = require('request');
var async = require('async');
var gauges = require('./gauges');

var exec = (host, action, cb) => {
  request({
    url: `${host}/v2/stats/${action}`,
    json: true
  }, (err, res, body) => {
    if(err){
      return cb(err);
    }

    if(!body || res.statusCode !== 200){
      var error = new Error(`unexpected response: ${res.statusCode}`);
      error.statusCode = res.statusCode;
      return cb(error);
    }

    cb(null, body);
  });
};

var self = (host, cb) => {
  exec(host, 'self', (err, body) => {
    if(err){
      return cb(err);
    }

    cb(null, gauges.self.map((g) => {
      return [g, body[g] || 0];
    }));
  });
};

var leader = (host, cb) => {
  exec(host, 'leader', (err, body) => {
    if(err && err.statusCode === 403){
      return cb(null, []);
    }

    if(err){
      return cb(err);
    }

    var res = Object.keys(body.followers).map((k) => {
      var f = body.followers[k];
      var latency = gauges.leader.latency.map((g) => {
        return [`latency.${g}`, f.latency[g] || 0];
      });
      var counts = gauges.leader.counts.map((g) => {
        return [`counts.${g}`, f.counts[g] || 0];
      });
      return {
        id: k,
        stats: latency.concat(counts)
      };
    });

    cb(null, res);
  });
};

var store = (host, cb) => {
  exec(host, 'store', (err, body) => {
    if(err){
      return cb(err);
    }

    cb(null, gauges.store.map((g) => {
      return [g, body[g] || 0];
    }));
  });
};

var stats = (host, cb) => {
  var result = {};
  async.parallel([
    (done) => {
      self(host, (err, res) => {
        result.self = res;
        done(err);
      });
    },
    (done) => {
      leader(host, (err, res) => {
        result.leader = res;
        done(err);
      });
    },
    (done) => {
      store(host, (err, res) => {
        result.store = res;
        done(err);
      });
    }
  ], (err) => {
    cb(err, result);
  });
};

module.exports.createClient = (options) => {
  var host = options.host;
  options.stats = (cb) => {
    return stats(host, cb);
  };
  return options;
};
