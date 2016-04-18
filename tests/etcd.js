'use strict';

var should = require('should');
var proxyquire = require('proxyquire');

describe('etcd client tests', () => {
  var metrics = [];
  var etcd;
  var client;
  var requestMock = (a, b) => {
    var res = {};
    if(a.url.indexOf('self') > -1){
      res = {
        'foo': 1,
        'bar': 2
      };
    }

    if(a.url.indexOf('store') > -1){
      res = {
        'foo': 1,
        'bar': 2
      };
    }

    if(a.url.indexOf('leader') > -1){
      res = {
        followers: {
          '1': {
            latency: {
              'foo': 1,
              'bar': 2
            },
            counts: {
              'foo': 1,
              'bar': 2
            }
          }
        }
      }
    }

    b(null, {
      statusCode: 200
    }, res);
  };

  beforeEach(() => {
    metrics = [];
    etcd = proxyquire('../lib/etcd', {
      'request': requestMock,
      './gauges': {
        self: [ 'foo', 'bar' ],
        store: [ 'foo', 'bar' ],
        leader: {
          latency: [ 'foo', 'bar' ],
          counts: [ 'foo', 'bar' ]
        }
      }
    });
    client = etcd.createClient({
      host: 'http://localhost:2379'
    });
  });

  describe('self stats', () => {
    it('should include all listed fields', (done) => {
      client.stats((err, result) => {
        result.self[0][0].should.equal('foo');
        result.self[0][1].should.equal(1);
        result.self[1][0].should.equal('bar');
        result.self[1][1].should.equal(2);
        done(err);
      });
    });
  });

  describe('store stats', () => {
    it('should include all listed fields', (done) => {
      client.stats((err, result) => {
        result.store[0][0].should.equal('foo');
        result.store[0][1].should.equal(1);
        result.store[1][0].should.equal('bar');
        result.store[1][1].should.equal(2);
        done(err);
      });
    });
  });

  describe('leader stats', () => {
    describe('latency', () => {
      it('should include all listed fields', (done) => {
        client.stats((err, result) => {
          result.leader[0].stats[0][0].should.equal('latency.foo');
          result.leader[0].stats[0][1].should.equal(1);
          result.leader[0].stats[1][0].should.equal('latency.bar');
          result.leader[0].stats[1][1].should.equal(2);          done(err);
        });
      });
    });

    describe('counts', () => {
      it('should include all listed fields', (done) => {
        client.stats((err, result) => {
          result.leader[0].stats[2][0].should.equal('counts.foo');
          result.leader[0].stats[2][1].should.equal(1);
          result.leader[0].stats[3][0].should.equal('counts.bar');
          result.leader[0].stats[3][1].should.equal(2);
          done(err);
        });
      });
    });
  });
});
