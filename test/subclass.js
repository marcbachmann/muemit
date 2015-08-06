var test = require('tape')
var util = require('util')
var EventEmitter = require('../')

function includes (t, arr, expect) {
  var included = true
  expect.forEach(function (el) { if (arr.indexOf(el) === -1) included = false })
  t.ok(included, 'Assertion error, ' + JSON.stringify(expect) + ' is not included in the array')
}

test('EventEmitter subclass', function (t) {

  t.test('works without executing the constructor', function (t) {
    t.plan(1)
    function MyEE (cb) { this.on('exec', cb) }
    util.inherits(MyEE, EventEmitter)

    var e1 = new MyEE(function () {
      t.ok(1, 'EventEmitter works without using EventEmitter.call(this)')
    })
    e1.emit('exec')
  })

  t.test('works flawlessly', function (t) {
    t.plan(4)
    function MyEE () {}
    util.inherits(MyEE, EventEmitter)

    var e1 = new MyEE()

    function cb (data) { t.equal(data, 'some-string') }
    function listener () { }
    e1.once('bar', listener)
    e1.on('foo', cb)
    e1.on('foo', listener)

    includes(t, e1.listeners(), [listener, cb, listener])
    e1.emit('bar')
    includes(t, e1.listeners(), [cb, listener])
    e1.emit('foo', 'some-string')
    e1.removeAllListeners()
    t.deepEqual(e1.listeners(), [])
  })
})
