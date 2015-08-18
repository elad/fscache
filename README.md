# fscache

Simple file cache.

## Install

```
npm install node-fscache
```

## Use

```js
var fscache = require('fscache');

var cache = new fscache();

cache.get('file.txt', function (err, data) {
  console.log(data);
});

```
