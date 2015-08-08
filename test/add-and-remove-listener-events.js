var test = require('tape')
var EventEmitter = require('../')

function listener1 () {}

test('addListener event', function (t) {

  t.test('gets sent when subscribing to an event', function (t) {
    t.plan(2)
    var e1 = new EventEmitter()
    e1.on('addListener', function (event, listener) {
      t.equal(event, 'foo')
      t.equal(listener, listener1)
    })

    e1.on('foo', listener1)
  })

  t.test('gets sent for .once subscription', function (t) {
    t.plan(2)
    var e1 = new EventEmitter()
    e1.on('addListener', function (event, listener) {
      t.equal(event, 'foo')
      t.equal(listener, listener1)
    })

    e1.once('foo', listener1)
  })

})

test('removeListener event', function (t) {

  t.test('gets sent when unsubscribng from an event', function (t) {
    t.plan(2)
    var e1 = new EventEmitter()
    e1.on('removeListener', function (event, listener) {
      t.equal(event, 'foo')
      t.equal(listener, listener1)
    })

    e1.on('foo', listener1)
    e1.removeListener('foo', listener1)
  })

  t.test('gets triggered when .once receives an event', function (t) {
    t.plan(2)
    var e1 = new EventEmitter()
    e1.on('removeListener', function (event, listener) {
      t.equal(event, 'foo')
      t.equal(listener, listener1)
    })

    e1.once('foo', listener1)
    e1.emit('foo', 'test')
  })

})
