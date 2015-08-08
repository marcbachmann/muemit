var test = require('tape')
var EventEmitter = require('../')

function listener () {}
function listener1 () {}

test('EventEmitter#once(event, listener)', function (t) {
  t.test('requires a listener', function (t) {
    t.plan(5)
    var e1 = new EventEmitter()
    t.throws(function () { e1.once() }, /listener must be a function/)
    t.throws(function () { e1.once('foo') }, /listener must be a function/)
    t.throws(function () { e1.once('foo', []) }, /listener must be a function/)
    t.throws(function () { e1.once('foo', 123) }, /listener must be a function/)
    t.doesNotThrow(function () { e1.once('foo', listener) })
  })

  t.test('returns instance to allow chaining', function (t) {
    t.plan(1)
    var e1 = new EventEmitter()
    t.equal(e1.once('foo', listener), e1)
  })

  t.test('receives data from .emit(event, args...) calls', function (t) {
    t.plan(5)
    var e1 = new EventEmitter()
    e1.once('test-number', function (number) { t.equal(number, 123) })
    e1.emit('test-number', 123)

    e1.once('test-string', function (string) { t.equal(string, 'foo') })
    e1.emit('test-string', 'foo')

    e1.once('test-multi-argument', function (string, number, func) {
      t.equal(string, 'foo')
      t.equal(number, 123)
      t.equal(func, listener)
    })

    e1.emit('test-multi-argument', 'foo', 123, listener)
  })

  t.test('does not receive a callback twice', function (t) {
    t.plan(1)
    var e1 = new EventEmitter()

    e1.once('foo', function (number) { t.equal(number, 123) })
    e1.emit('foo', 123)
    e1.emit('foo')
  })

  t.test('does not show up in the listeners after receiving the event', function (t) {
    t.plan(2)
    var e1 = new EventEmitter()

    e1.on('foo', listener1)
    e1.once('foo', listener)
    e1.once('foo', listener1)
    e1.on('foo', listener1)
    t.deepEqual(e1.listeners('foo'), [listener1, listener, listener1, listener1])

    e1.emit('foo', 123)
    t.deepEqual(e1.listeners('foo'), [listener1, listener1])
  })
})
