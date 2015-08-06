var test = require('tape')
var EventEmitter = require('../')

function listener () {}

test('EventEmitter#emit("error", [error])', function (t) {
  t.test('throws an error if there are no listeners', function (t) {
    t.plan(3)
    t.throws(function () {
      var e1 = new EventEmitter()
      e1.emit('error')
    }, /Uncaught, unspecified "error" event\./)

    t.throws(function () {
      var e1 = new EventEmitter()
      e1.emit('error', new Error('foo'))
    }, /foo/)

    t.throws(function () {
      var e1 = new EventEmitter()
      e1.emit('error', 'test')
    }, /Uncaught, unspecified "error" event\. \(test\)/)
  })

  t.test('does not throw if there are listeners', function (t) {
    t.plan(1)
    t.doesNotThrow(function () {
      var e1 = new EventEmitter()
      e1.on('error', listener)
      e1.emit('error', 'err')
    })
  })
})
