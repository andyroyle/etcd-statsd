'use strict';

module.exports.self = [
  'recvAppendRequestCnt',
  'recvAppendRequestCnt',
  'recvPkgRate',
  'recvBandwidthRate',
  'sendAppendRequestCnt'
];

module.exports.leader = {
  latency: [
    'current',
    'average',
    'standardDeviation',
    'minimum',
    'maximum'
  ],
  counts: [
    'fail',
    'success'
  ]
};

module.exports.store = [
  'getsSuccess',
  'getsFail',
  'setsSuccess',
  'setsFail',
  'deleteSuccess',
  'deleteFail',
  'updateSuccess',
  'updateFail',
  'createSuccess',
  'createFail',
  'compareAndSwapSuccess',
  'compareAndSwapFail',
  'compareAndDeleteSuccess',
  'compareAndDeleteFail',
  'expireCount',
  'watchers'
];
