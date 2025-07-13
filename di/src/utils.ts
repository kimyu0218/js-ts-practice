export function getClassName(target: any): any {
  if (typeof target === 'function') {
    const prototype = target.prototype;
    if (prototype && prototype.hasOwnProperty('__classname__') && prototype.__classname__) {
      return prototype.__classname__;
    }

    let retval = '';
    if (target.name) {
      retval = target.name;
    }
    if (target.toString) {
      var arr,
        str = target.toString();
      if (str.charAt(0) === '[') {
        arr = str.match(/\[\w+\s*(\w+)\]/);
      } else {
        arr = str.match(/function\s*(\w+)/);
      }
      if (arr && arr.length === 2) {
        retval = arr[1];
      }
    }
    return retval !== 'Object' ? retval : '';
  }
  if (target && target.constructor) {
    return getClassName(target.constructor);
  }
  return '';
}
