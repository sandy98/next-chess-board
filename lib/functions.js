/* General functions */

const range = (b = 0, e = b + 8, r = []) => 
b === e ? r : range(b < e ? b + 1 : b - 1, e, [...r, b])

const compose = (...fns) => (arg) => fns.reduce((a, f) => f(a), arg)

const partition = (arr, n = 8, r = []) => 
arr.length > 0 ? partition(arr.slice(n), n, [...r, arr.slice(0, n)]) : r

/* End of general functions */

if (typeof exports !== 'undefined') exports.range = range;
if (typeof exports !== 'undefined') exports.compose = compose;
if (typeof exports !== 'undefined') exports.partition = partition;

/* export functions for any RequireJS compatible environment */
if (typeof define !== 'undefined') define( function () { return range;});
if (typeof define !== 'undefined') define( function () { return compose;});
if (typeof define !== 'undefined') define( function () { return partition;});
