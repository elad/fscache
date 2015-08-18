var path = require('path');
var fs = require('fs');

var defaults = {
  basedir: '',
  watch: true
};

function fscache(options) {
  this.options = options || {};
  this.options.basedir = this.options.basedir || defaults.basedir;
  this.options.watch = this.options.hasOwnProperty('watch') ? this.options.watch : defaults.watch;

  this.cache = {};

  var that = this;

  this.load = function(filepath, callback) {
    // Read the data, store it in the cache, and return it.
    return fs.readFile(filepath, { encoding: 'utf-8' }, function (err, data) {
      if (!err) {
        that.cache[filepath] = data;
      }

      if (callback) {
        return callback(err, data);
      }
    });
  }

  this.watcher = function(event, filepath) {
    if (event !== 'change') {
      return;
    }

    filepath = path.resolve(filepath);

    that.load(filepath);
  }

  this.get = function(filepath, callback) {
    // If it's not an absolute path, attach basedir if we have it.
    if (!path.isAbsolute(filepath)) {
      filepath = path.join(that.options.basedir, filepath);
    }
    // Cache keys are always absolute paths.
    filepath = path.resolve(filepath);

    // See if we have data in the cache.
    if (that.cache.hasOwnProperty(filepath)) {
      return callback(null, that.cache[filepath]);
    }

    if (that.options.watch) {
      fs.watch(filepath, { persistent: false }, that.watcher);
    }

    that.load(filepath, callback);
  }

  return this;
}

module.exports = fscache;