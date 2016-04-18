'use strict';

var gauges = require('./gauges');
var StatsD = require('statsd-client');
var path = require('path');
var configDir = path.resolve(process.argv[2] || './');
var statsConfig = require(path.join(configDir, 'statsd'));
var util = require('util');

var statsdClient = new StatsD({
  host: statsConfig.host,
  port: statsConfig.port,
  prefix: statsConfig.prefix,
  debug: statsConfig.debug || false
});

var buildTags = (tags) => {
  return Object.keys(tags || {})
    .map((k, v) => {
      return `${k}=${tags[k]}`;
    }).join(',');
};

var log = (stats, type, c) => {
  stats.forEach((f) => {
    var prefix = '';

    if(c.prefix && c.prefix.length > 0){
      prefix = `${c.prefix}.`;
    }

    var suffix = '';
    if(c.tags && Object.keys(c.tags).length > 0){
      suffix = `,${buildTags(c.tags)}`;
    }

    statsdClient.gauge(
      `${prefix}etcd.${type}.${f[0]}${suffix}`,
      f[1]);
  });
};

module.exports = {
  log: (stats, c) => {
    log(stats.self, 'self', c);
    log(stats.store, 'store', c);

    stats.leader.forEach((s) =>{
      c.tags.id = s.id;
      log(s.stats, 'leader', c);
    });
  }
};
