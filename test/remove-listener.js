var test = require('tape')
var EventEmitter = require('../')

function listener1 () {}
function listener2 () {}

test('EventEmitter#removeListener(event, listener)', function (t) {

  t.test('requires a listener method and an event', function (t) {
    t.plan(4)
    var e1 = new EventEmitter()
    t.throws(function () { e1.removeListener() })
    t.throws(function () { e1.removeListener('foo') })
    t.throws(function () { e1.removeListener('foo', 'bar') })
    t.doesNotThrow(function () { e1.removeListener('foo', listener1) })
  })

  t.test('returns instance to allow chaining', function (t) {
    t.plan(3)
    var e1 = new EventEmitter()
    var e2 = new EventEmitter()

    e1.on('foo', listener1)
    e2.on('foo', listener2)

    t.equal(e1.removeListener('foo', listener1), e1)
    t.equal(e2.removeListener('foo', function () {}), e2)
    t.equal(e2.removeListener('not-existent', function () {}), e2)
  })

  t.test('does not influence other listeners', function (t) {
    t.plan(2)
    var e1 = new EventEmitter()
    var e2 = new EventEmitter()

    e1.on('foo', listener1)
    e1.on('foo', listener2)
    e2.on('bar', listener2)

    e1.removeListener('foo', listener1)

    t.deepEqual(e1.listeners(), [listener2])
    t.deepEqual(e2.listeners(), [listener2])
  })

  t.test('works with EventEmitter#once(event, listener)', function (t) {
    t.plan(2)
    var e1 = new EventEmitter()
    e1.once('foo', listener1)
    e1.once('bar', listener1)
    t.deepEqual(e1.listeners(), [listener1, listener1])
    e1.removeListener('foo', listener1)
    t.deepEqual(e1.listeners(), [listener1])
  })

  t.test('removes all occurrences of the same event-listener combination', function (t) {
    t.plan(1)
    var e1 = new EventEmitter()

    e1.on('foo', listener1)
    e1.on('foo', listener1)
    e1.on('foo', listener2)

    e1.removeListener('foo', listener1)
    t.deepEqual(e1.listeners(), [listener2])
  })
})
