var test = require('tape')
var EventEmitter = require('../')

function listener () {}

test('EventEmitter#emit(event [, args...])', function (t) {
  t.test('returns false if there are no listeners', function (t) {
    t.plan(3)
    var e1 = new EventEmitter()
    t.equal(e1.emit(), false)
    t.equal(e1.emit('foo'), false)
    t.equal(e1.emit('qux', 123), false)
  })

  t.test('returns true if there are listeners', function (t) {
    t.plan(4)
    var e1 = new EventEmitter()
    e1.on('foo', function () { t.ok(1, 'receives the event') })
    e1.on('bar', listener)
    t.equal(e1.emit('foo'), true)
    t.equal(e1.emit('bar'), true)
    t.equal(e1.emit('bar', 'test'), true)
  })

  t.test('allows to emit everything', function (t) {
    t.plan(7)
    var e1 = new EventEmitter()
    e1.on('foo', listener)
    t.equal(e1.emit('foo', undefined), true)
    t.equal(e1.emit('foo', false), true)
    t.equal(e1.emit('foo', 123), true)
    t.equal(e1.emit('foo', 'foo'), true)
    t.equal(e1.emit('foo', function () {}), true)
    t.equal(e1.emit('foo', []), true)
    t.equal(e1.emit('foo', [], 'foo', 123), true)
  })
})
