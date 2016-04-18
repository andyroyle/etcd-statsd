'use strict';

var path = require('path');
var util = require('util');
var configDir = path.resolve(process.argv[2] || './');
var statsConfig = require(path.join(configDir, 'statsd'));
var etcd = require('./lib/etcd');
var logger = require('./lib/statsdLogger');

var async = require('async');

util.log('starting...');
util.log(`using config from ${configDir}`);

var etcdServers = require(path.join(configDir, 'etcd.json')).map(function(c){
  var client = etcd.createClient({
    host: c.host,
    tags: c.tags,
    prefix: c.prefix
  });
  return client;
});

etcdServers.forEach((c) => {
  setInterval(() => {
    c.stats((err, stats) => {
      if(err){
        util.log(`[${c.host}] ${err}`);
        return;
      }
      logger.log(stats, c);
    });
  }, (statsConfig.interval || 10) * 1000);
});
