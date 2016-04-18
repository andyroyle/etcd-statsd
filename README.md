Etcd StatsD [![Build Status](https://travis-ci.org/andyroyle/etcd-statsd.svg?branch=master)](https://travis-ci.org/andyroyle/etcd-statsd)
---

A little app that will poll one or more etcd instances and push their statistics out to statsd.

```
npm i -g etcd-statsd
etcd-statsd /path/to/config/files/
```

###Gauges

Store:

- getsSuccess
- getsFail
- setsSuccess
- setsFail
- deleteSuccess
- deleteFail
- updateSuccess
- updateFail
- createSuccess
- createFail
- compareAndSwapSuccess
- compareAndSwapFail
- compareAndDeleteSuccess
- compareAndDeleteFail
- expireCount
- watchers

Self:

- recvAppendRequestCnt
- recvAppendRequestCnt
- recvPkgRate
- recvBandwidthRate
- sendAppendRequestCnt

Leader (foreach follower):

- latency:
  - current
  - average
  - standardDeviation
  - minimum
  - maximum
- counts:
  - fail
  - success

###Config Files

###etcd.json
```javascript
[
  {
    "host": "https://localhost:2379",
    "prefix": "foo.bar.yay", // optional prefix for metrics from this instance
    "tags": {                      // optional, tags are supported by the influxdb backend
      "foo": "bar"
    }
  },
  {
     //...
  }
]
```

###statsd.json
```javascript
{
  "host": "localhost",
  "port": 8125,          // default: 8125
  "interval": 10,        // how often to poll the etcd servers, default: 10 seconds
  "debug": true,         // show debug output from the statsd client
  "prefix": "my.stats"   // global prefix for metrics
}
```
