var test = require('tape')
var EventEmitter = require('../')

function listener1 () {}
function listener2 () {}

test('EventEmitter#removeAllListeners([event])', function (t) {
  t.test('returns instance to allow chaining', function (t) {
    t.plan(3)
    var e1 = new EventEmitter()
    var e2 = new EventEmitter()
    var e3 = new EventEmitter()

    e1.on('foo', listener1)
    e2.on('foo', listener2)
    e2.on('bar', listener2)

    t.equal(e1.removeAllListeners(), e1)
    t.equal(e2.removeAllListeners(), e2)
    t.equal(e3.removeAllListeners(), e3)
  })

  t.test('removes all events', function (t) {
    t.plan(3)
    var e1 = new EventEmitter()
    var e2 = new EventEmitter()
    var e3 = new EventEmitter()

    e1.on('foo', listener1)
    e1.on('foo', listener2)
    e2.on('bar', listener2)
    e3.on('bar', listener2)

    e1.removeAllListeners()
    e2.removeAllListeners()

    t.deepEqual(e1.listeners('foo'), [])
    t.deepEqual(e2.listeners('bar'), [])
    t.deepEqual(e3.listeners('bar'), [listener2], 'Does not influence other EventEmitters')
  })

  t.test('allows to remove specific events', function (t) {
    t.plan(3)
    var e1 = new EventEmitter()
    var e2 = new EventEmitter()

    e1.on('foo', listener1)
    e1.on('foo', listener2)
    e2.on('foo', listener2)
    e2.on('bar', listener2)

    e1.removeAllListeners('foo')
    e2.removeAllListeners('bar')
    t.deepEqual(e1.listeners('foo'), [])
    t.deepEqual(e2.listeners('bar'), [])
    t.deepEqual(e2.listeners('foo'), [listener2])
  })

  t.test('works with EventEmitter#once(event, listener)', function (t) {
    t.plan(4)
    var e1 = new EventEmitter()
    e1.once('foo', listener2)
    e1.once('bar', listener2)
    t.deepEqual(e1.listeners('foo'), [listener2])
    t.deepEqual(e1.listeners('bar'), [listener2])
    e1.removeAllListeners()
    t.deepEqual(e1.listeners('foo'), [])
    t.deepEqual(e1.listeners('bar'), [])
  })
})
