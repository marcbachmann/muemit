var test = require('tape')
var EventEmitter = require('../')

function listener () {}

test('EventEmitter#on(event, listener)', function (t) {
  t.test('requires a listener', function (t) {
    t.plan(5)
    var e1 = new EventEmitter()
    t.throws(function () { e1.on() }, /listener must be a function/)
    t.throws(function () { e1.on('foo') }, /listener must be a function/)
    t.throws(function () { e1.on('foo', []) }, /listener must be a function/)
    t.throws(function () { e1.on('foo', 123) }, /listener must be a function/)
    t.doesNotThrow(function () { e1.on('foo', listener) })
  })

  t.test('returns instance to allow chaining', function (t) {
    t.plan(1)
    var e1 = new EventEmitter()
    t.equal(e1.on('foo', listener), e1)
  })

  t.test('receives data from .emit(event, args...) calls', function (t) {
    t.plan(5)
    var e1 = new EventEmitter()
    e1.on('test-number', function (number) { t.equal(number, 123) })
    e1.emit('test-number', 123)

    e1.on('test-string', function (string) { t.equal(string, 'foo') })
    e1.emit('test-string', 'foo')

    e1.on('test-multi-argument', function (string, number, func) {
      t.equal(string, 'foo')
      t.equal(number, 123)
      t.equal(func, listener)
    })

    e1.emit('test-multi-argument', 'foo', 123, listener)
  })
})
