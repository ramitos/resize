/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(p, parent, orig){
  var path = require.resolve(p)
    , mod = require.modules[path];

  // lookup failed
  if (null == path) {
    orig = orig || p;
    parent = parent || 'root';
    throw new Error('failed to require "' + orig + '" from "' + parent + '"');
  }

  // perform real require()
  // by invoking the module's
  // registered function
  if (!mod.exports) {
    mod.exports = {};
    mod.client = mod.component = true;
    mod.call(this, mod, mod.exports, require.relative(path));
  }

  return mod.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path){
  var orig = path
    , reg = path + '.js'
    , regJSON = path + '.json'
    , index = path + '/index.js'
    , indexJSON = path + '/index.json';

  return require.modules[reg] && reg
    || require.modules[regJSON] && regJSON
    || require.modules[index] && index
    || require.modules[indexJSON] && indexJSON
    || require.modules[orig] && orig
    || require.aliases[index];
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `fn`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

require.register = function(path, fn){
  require.modules[path] = fn;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to){
  var fn = require.modules[from];
  if (!fn) throw new Error('failed to alias "' + from + '", it does not exist');
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj){
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function fn(path){
    var orig = path;
    path = fn.resolve(path);
    return require(path, parent, orig);
  }

  /**
   * Resolve relative to the parent.
   */

  fn.resolve = function(path){
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  fn.exists = function(path){
    return !! require.modules[fn.resolve(path)];
  };

  return fn;
};require.register("ramitos-iseventsupported/src/iseventsupported.js", function(module, exports, require){
/**
 * @method isEventSupported
 * @param {String} eventName
 * @param {HTMLElement} element optional
 * @return {Boolean} true if event is supported
 *
 * Note that `isEventSupported` can give false positives when passed augmented host objects, e.g.:
 *
 *     someElement.onfoo = function(){ };
 *     isEventSupported('foo', someElement); // true (even if "foo" is not supported)
 *
 * Also note that in Gecko clients (those that utilize `setAttribute` -based detection) -
 *
 *     `isEventSupported('foo', someElement)`;
 *
 * - might create `someElement.foo` property (if "foo" event is supported) which apparently can not be deleted
 * `isEventSupported` sets such property to `undefined` value, but can not fully remove it
 *
 */

var tagnames = require('./tagnames');

var cache = {};

var isSupported = function (cacheable, event, supported) {
  if(cacheable) return cache[event] = supported;
  else return supported;
};

module.exports = function (event, element) {
  var cacheable = (arguments.length === 1);
  
  // only return cached result when no element is given
  if(cacheable && cache[event]) return cache[event];
  
  if(!element) element = document.createElement(tagnames[event] || 'div');
  event = 'on' + event;
  
  // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
  var supported = (event in element);
  
  if(supported) return isSupported(cacheable, event, supported);
  
  // if it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
  if(!element.setAttribute) element = document.createElement('div');
  
  if(!(element.setAttribute && element.removeAttribute)) return isSupported(cacheable, event, supported);
  
  element.setAttribute(event, '');
  supported = typeof element[event] == 'function';
  
  // if property was created, "remove it" (by setting value to `undefined`)
  if(typeof element[event] != 'undefined') element[event] = undefined;
  element.removeAttribute(event);
  
  if(supported) return isSupported(cacheable, event, supported);
};
});
require.register("ramitos-iseventsupported/src/tagnames.js", function(module, exports, require){
module.exports = {
  select : 'input',
  change : 'input',
  submit : 'form',
  reset  : 'form',
  error  : 'img',
  load   : 'img',
  abort  : 'img'
}
});
require.register("component-event/index.js", function(module, exports, require){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (el.addEventListener) {
    el.addEventListener(type, fn, capture);
  } else {
    el.attachEvent('on' + type, fn);
  }
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture);
  } else {
    el.detachEvent('on' + type, fn);
  }
};
});
require.register("resize/src/resize.js", function(module, exports, require){
var binds = {};

module.exports.bind = function (element, cb, ms) {
  if(!binds[element]) binds[element] = {};
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  if(!ms) ms = 250;
  
  binds[element][cb] = setInterval(function () {
    if((width === element.offsetWidth) && (height === element.offsetHeight)) return;
    height = element.offsetHeight;
    width = element.offsetWidth;
    cb(element);
  }, ms);
};

module.exports.unbind = function (element, cb) {
  if(!binds[element][cb]) return;
  clearInterval(binds[element][cb]);
};
});
require.alias("ramitos-iseventsupported/src/iseventsupported.js", "resize/deps/iseventsupported/src/iseventsupported.js");
require.alias("ramitos-iseventsupported/src/tagnames.js", "resize/deps/iseventsupported/src/tagnames.js");
require.alias("ramitos-iseventsupported/src/iseventsupported.js", "resize/deps/iseventsupported/index.js");

require.alias("component-event/index.js", "resize/deps/event/index.js");

require.alias("resize/src/resize.js", "resize/index.js");
