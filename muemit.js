function EventEmitter () {
  this._events = {}
}

EventEmitter.listenerCount = function (emitter, event) {
  return emitter.listeners(event).length
}

EventEmitter.prototype.on =
EventEmitter.prototype.addListener = function (event, listener) {
  on.call(this, event, listener)
  return this
}

EventEmitter.prototype.once = function (event, listener) {
  on.call(this, event, listener, true)
  return this
}

EventEmitter.prototype.emit = function (event) {
  if (!this._events) return false
  var args = Array.prototype.slice.call(arguments, 1)
  var listeners = this._events[event] || []
  if (listeners.length === 0) {
    // nodejs error error event behaviour
    if (event !== 'error') return false
    var err = args[0]
    if (err instanceof Error) throw err
    var error = new Error('Uncaught, unspecified "error" event.' + (err ? ' (' + err + ')' : ''))
    error.context = err
    throw error
  }

  this._events[event] = map(listeners, function (l) {
    l.listener.apply(l.listener, args)
    if (l.once !== true) return l
  })
  return true
}

EventEmitter.prototype.listeners = function (event) {
  if (!this._events) return []
  if (event) return getListeners.call(this, this._events[event])
  return [].concat.apply([], map(this._events, getListeners, this))
}

EventEmitter.prototype.removeListener = function (event, listener) {
  assertListener(listener)
  if (this._events) this._events[event] = (this._events[event] || []).filter(function (l) { return l.listener !== listener })
  return this
}

EventEmitter.prototype.removeAllListeners = function (event) {
  if (this._events && event) this._events[event] = []
  else this._events = {}
  return this
}

function on (event, listener, once) {
  assertListener(listener)
  if (!this._events) this._events = {}
  if (!this._events[event]) this._events[event] = []
  this._events[event].push({listener: listener, once: once})
}

function assertListener (listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('listener must be a function')
  }
}

function getListeners (arr) {
  return map(arr, function (l) { return l.listener })
}

// A combination of a filter && map method
// You can return falsy value to exclude it from the array
function map (arr, func, thisBinding) {
  if (!arr) return []
  var val
  var elems = []
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    for (var i = arr.length - 1; i >= 0; i--) {
      val = func.call(thisBinding, arr[i])
      if (val) elems.push(val)
    }
  } else {
    for (i in arr) {
      val = func.call(thisBinding, arr[i])
      if (val) elems.push(val)
    }
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
