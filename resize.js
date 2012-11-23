module.exports.bind = function (element, cb, ms) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  if(!ms) ms= 250;
  
  var tid = setInterval(function () {
    if(width === element.offsetWidth && height === element.offsetHeight) return;
    height = element.offsetHeight;
    width = element.offsetWidth;
    cb(height, width);
  }, ms);
    
  var unbind = function () {
    clearInterval(tid);
  };
  
  return {unbind: unbind};
};