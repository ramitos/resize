# resize

resize event for any DOM element with polling. [demo](http://ramitos.github.com/resize)

## install

```bash
$ component install ramitos/resize
```

## example

```js
var resize = require('resize');

resize.bind(document.getElementById('mytagname'), function (height, width) {});
``

## api

#### bind(element, callback[, pollingInterval])

`pollingInterval` default is `250ms`

#### unbind(element, callback)

## license

MIT