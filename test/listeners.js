var test = require('tape')
var EventEmitter = require('../')

function includes (t, arr, expect) {
  var included = true
  expect.forEach(function (el) { if (arr.indexOf(el) === -1) included = false })
  t.ok(included, 'The functions ' + String(expect) + ' are included in the array')
}

function listener1 () {}
function listener2 () {}

test('EventEmitter#listeners([event])', function (t) {
  t.test('returns an empty array if there are no listeners', function (t) {
    t.plan(1)
    var e1 = new EventEmitter()
    t.deepEqual(e1.listeners(), [])
  })

  t.test('accepts an optional even', function (t) {
    t.plan(3)
    var e1 = new EventEmitter()
    e1.on('foo', listener1)
    e1.on('bar', listener2)
    t.deepEqual(e1.listeners('foo'), [listener1])
    t.deepEqual(e1.listeners('bar'), [listener2])
    includes(t, e1.listeners(), [listener1, listener2])
  })

  t.test('does not alter its previous array', function (t) {
    t.plan(3)
    var e1 = new EventEmitter()
    var listeners = e1.listeners()
    e1.on('foo', listener1)

    var listeners1 = e1.listeners()

    e1.on('bar', listener2)
    var listeners2 = e1.listeners()

    t.deepEqual(listeners, [])
    t.deepEqual(listeners1, [listener1])
    includes(t, listeners2, [listener1, listener2])
  })

  t.test('shows all subscriptions', function (t) {
    t.plan(1)
    var e1 = new EventEmitter()
    e1.on('foo', listener1)
    e1.on('foo', listener1)
    e1.on('bar', listener1)
    t.deepEqual(e1.listeners(), [listener1, listener1, listener1])
  })
})
