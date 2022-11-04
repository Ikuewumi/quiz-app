"use strict";
exports.__esModule = true;
exports.sleep = void 0;
var sleep = function (ms) {
    if (ms === void 0) { ms = 2000; }
    return new Promise(function (r) { return setTimeout(r, ms); });
};
exports.sleep = sleep;
