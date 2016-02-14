// Constructor initialization isn't needed when sub-classing the EventEmitter
// this._e contains listener object keyed by event name
// e.g. this._e = { 'data': [{listener: function(){}, once: true}] }
function EventEmitter () {}

EventEmitter.listenerCount = function (emitter, event) {
  if (!(emitter instanceof EventEmitter)) throw new Error('emitter must be an EventEmitter instance.')
  return emitter.listeners(event).length
}

var p = EventEmitter.prototype
p.on =
p.addListener = function (event, listener) {
  on.call(this, event, listener)
  return this
}

p.once = function (event, listener) {
  on.call(this, event, listener, true)
  return this
}

var emitMany = {
  1: function (listener) { listener() },
  2: function (listener, args) { listener(args[1]) },
  3: function (listener, args) { listener(args[1], args[2]) },
  4: function (listener, args) { listener(args[1], args[2], args[3]) },
  x: function (listener, args) { listener.apply(null, Array.prototype.slice.call(args, 1)) }
}

p.emit = function (event) {
  var args = arguments
  var events = this._e || (this._e = {})
  var listeners = events[event] || []
  if (listeners.length === 0) {
    // nodejs error error event behaviour
    if (event !== 'error') return false
    var error = args[1]
    if (error instanceof Error) throw error
    error = new Error('Uncaught, unspecified "error" event.' + (error ? ' (' + error + ')' : ''))
    error.context = args[1]
    throw error
  }

  var emitter = emitMany[args.length] || emitMany.x
  var ls = []
  var l
  for (var i = 0; i < listeners.length; i++) {
    l = listeners[i]
    emitter(l.listener, args)
    if (l.once !== true) ls[ls.length] = l
    else if (typeof events.removeListener !== 'undefined') this.emit('removeListener', event, l.listener)
  }
  events[event] = ls
  return true
}

p.listeners = function (event) {
  if (!this._e) return []
  return map(this._e[event], getListeners)
}

p.removeListener = function (event, listener) {
  assertListener(listener)
  var e = this._e || {}
  if (!e[event]) return this

  e[event] = map(e[event], function (l) {
    if (l.listener !== listener) return l
    if (e.removeListener) this.emit('removeListener', event, l.listener)
  }, this)

  return this
}

p.removeAllListeners = function (event) {
  var events = this._e || (this._e = {})
  if (!events) return this
  if (!event) map(Object.keys(events), function (event) { this.removeAllListeners(event) }, this)
  else {
    var removed = events[event]
    events[event] = []
    if (events.removeListener) map(removed, function (l) { this.emit('removeListener', event, l.listener) }, this)
  }
  return this
}

function on (event, listener, once) {
  assertListener(listener)
  var events = this._e || (this._e = {})
  if (events.addListener) { this.emit('addListener', event, listener) }
  (events[event] || (events[event] = []))[events[event].length] = {listener: listener, once: once}
}

function assertListener (listener) {
  if (typeof listener !== 'function') throw new TypeError('listener must be a function')
}

function getListeners (l) { return l.listener }

// A combination of a filter && map method
// You can return a falsy value to exclude it from the array
function map (arr, func, thisBinding) {
  if (!arr) return []
  var val
  var elems = []
  for (var i = 0; i < arr.length; i++) {
    val = func.call(thisBinding, arr[i])
    if (val) elems[elems.length] = val
  }
  return elems
}

// AMD exports
(function (root, factory) {
  var define = define
  if (typeof module === 'object' && module.exports) module.exports = factory()
  else if (typeof define === 'function' && define.amd) define([], factory)
  else root.muemit = factory()
}(this, function () {
  return EventEmitter
}))
