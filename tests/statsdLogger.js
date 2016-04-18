var proxyquire = require('proxyquire').noCallThru();
var should = require('should');
var statsdLogger;

describe('statsdLogger tests', () => {
  var metrics = [];

  function Client() {}
  Client.prototype.gauge = (m, v) => {
    metrics.push({ m: m, v: v });
  };

  beforeEach(() => {
    metrics = [];
    statsdLogger = proxyquire('../lib/statsdLogger', {
      'statsd': {
        host: 'foo'
      },
      'statsd-client': Client,
      path: {
        resolve: (a) => { return a },
        join: (a, b) => { return b }
      }
    });
  });

  describe('logging store metrics', () => {
    it('should log all the given fields', () => {
      statsdLogger.log({
        self: [],
        store: [
          ['foo', 1],
          ['bar', 2]
        ],
        leader: []
      }, {
        tags: {}
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('etcd.store.foo');
      metrics[0].v.should.equal(1);
      metrics[1].m.should.equal('etcd.store.bar');
      metrics[1].v.should.equal(2);
    });

    it('should not log missing fields', () => {
      statsdLogger.log({
        self: [],
        store: [],
        leader: []
      });
      metrics.length.should.equal(0);
    });

    it('should append given tags', () => {
      statsdLogger.log({
        self: [],
        store: [
          ['foo', 1],
          ['bar', 2]
        ],
        leader: []
      }, {
        tags: {
          'foo': 'bar',
          'flarg': 'baz'
        }
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('etcd.store.foo,foo=bar,flarg=baz');
      metrics[1].m.should.equal('etcd.store.bar,foo=bar,flarg=baz');
    });

    it('should use instance prefix', () => {
      statsdLogger.log({
        self: [],
        store: [
          ['foo', 1],
          ['bar', 2]
        ],
        leader: []
      }, {
        prefix: 'boo',
        tags: {}
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('boo.etcd.store.foo');
      metrics[1].m.should.equal('boo.etcd.store.bar');
    });
  });

  describe('logging self metrics', () => {
    it('should log all the given fields', () => {
      statsdLogger.log({
        self: [
          ['foo', 1],
          ['bar', 2]
        ],
        store: [],
        leader: []
      }, {
        tags: {}
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('etcd.self.foo');
      metrics[0].v.should.equal(1);
      metrics[1].m.should.equal('etcd.self.bar');
      metrics[1].v.should.equal(2);
    });

    it('should not log missing fields', () => {
      statsdLogger.log({
        self: [],
        store: [],
        leader: []
      });
      metrics.length.should.equal(0);
    });

    it('should append given tags', () => {
      statsdLogger.log({
        self: [
          ['foo', 1],
          ['bar', 2]
        ],
        store: [],
        leader: []
      }, {
        tags: {
          'foo': 'bar',
          'flarg': 'baz'
        }
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('etcd.self.foo,foo=bar,flarg=baz');
      metrics[1].m.should.equal('etcd.self.bar,foo=bar,flarg=baz');
    });

    it('should use instance prefix', () => {
      statsdLogger.log({
        self: [
          ['foo', 1],
          ['bar', 2]
        ],
        store: [],
        leader: []
      }, {
        prefix: 'boo',
        tags: {}
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('boo.etcd.self.foo');
      metrics[1].m.should.equal('boo.etcd.self.bar');
    });
  });

  describe('logging leader metrics', () => {
    it('should log all the given fields', () => {
      statsdLogger.log({
        self: [],
        store: [],
        leader: [{
          id: '1',
          stats: [
              ['foo', 1],
              ['bar', 2]
          ]
        }]
      }, {
        tags: {}
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('etcd.leader.foo,id=1');
      metrics[0].v.should.equal(1);
      metrics[1].m.should.equal('etcd.leader.bar,id=1');
      metrics[1].v.should.equal(2);
    });

    it('should not log missing fields', () => {
      statsdLogger.log({
        self: [],
        store: [],
        leader: []
      });
      metrics.length.should.equal(0);
    });

    it('should append given tags', () => {
      statsdLogger.log({
        self: [],
        store: [],
        leader: [{
          id: '1',
          stats: [
              ['foo', 1],
              ['bar', 2]
          ]
        }]
      }, {
        tags: {
          'foo': 'bar',
          'flarg': 'baz'
        }
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('etcd.leader.foo,foo=bar,flarg=baz,id=1');
      metrics[1].m.should.equal('etcd.leader.bar,foo=bar,flarg=baz,id=1');
    });

    it('should use instance prefix', () => {
      statsdLogger.log({
        self: [],
        store: [],
        leader: [{
          id: '1',
          stats: [
              ['foo', 1],
              ['bar', 2]
          ]
        }]
      }, {
        prefix: 'boo',
        tags: {}
      });
      metrics.length.should.equal(2);
      metrics[0].m.should.equal('boo.etcd.leader.foo,id=1');
      metrics[1].m.should.equal('boo.etcd.leader.bar,id=1');
    });
  });
});
