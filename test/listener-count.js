var test = require('tape')
var EventEmitter = require('../')

function listener () {}

test('EventEmitter.listenerCount(eventEmitter, event)', function (t) {
  t.test('throws if invalid parameters get passed', function (t) {
    t.plan(3)
    t.throws(function () { EventEmitter.listenerCount() })
    t.throws(function () { EventEmitter.listenerCount('bar') })
    t.throws(function () { EventEmitter.listenerCount(undefined, 'bar') })
  })

  t.test('returns the count of an event', function (t) {
    t.plan(6)
    var e1 = new EventEmitter()
    t.equal(EventEmitter.listenerCount(e1, 'foo'), 0)
    e1.on('foo', listener)
    t.equal(EventEmitter.listenerCount(e1, 'foo'), 1)
    e1.once('foo', listener)
    e1.once('bar', listener)
    t.equal(EventEmitter.listenerCount(e1, 'foo'), 2)
    t.equal(EventEmitter.listenerCount(e1, 'bar'), 1)
    e1.emit('bar', listener)
    t.equal(EventEmitter.listenerCount(e1, 'foo'), 2)
    t.equal(EventEmitter.listenerCount(e1, 'bar'), 0)
  })
})
