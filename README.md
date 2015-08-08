# muemit

An tiny EventEmitter implementation that imitates the node.js EventEmitter API.
Meant to run in the browser - at a size of 839bytes (minified & gzipped).

## API

### Initialization
```
var EventEmitter = require('muemit')
var emitter = new EventEmitter()
```


### emitter.addListener(event, listener)
### emitter.on(event, listener)
Adds a listener to the end of the listeners array for the specified event. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of event and listener will result in the listener being added multiple times.
```
var something = new EventEmitter()
something.on('data', function (data) {
  console.log("Here's our data object");
});

getSomeData(function(err, data) {
  if (err) return something.emit('error', err)
  something.emit('data', data)
})
```

This method emits an `addListener` event.

### emitter.once(event, listener)
Adds a one time listener for the event. This listener is invoked only the next time the event is fired, after which it is removed.

```
var something = new EventEmitter()
something.once('data', function () {
  console.log("Here's our first data object!");
});

getSomeData(function(data, err) {
  something.emit('data')
})
```


### emitter.emit(event[, arg1][, arg2][, ...])
Execute each of the listeners in order with the supplied arguments.

Returns true if event had listeners, false otherwise.


### emitter.removeListener(event, listener)
Remove a listener from the listener array for the specified event. Caution: changes array indices in the listener array behind the listener.

This method emits an `removeListener` event.


### emitter.removeAllListeners([event])
Removes all listeners, or those of the specified event.
It sends a `removeListener` event for every listener that got removed.

Returns emitter, so calls can be chained.


### emitter.listeners([event])
Returns all listeners as an array, or only the listeners of the specified event.


### EventEmitter.listenerCount(emitter, event)
Return the number of listeners for a given event.
