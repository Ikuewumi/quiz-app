"use strict";
exports.__esModule = true;
exports.Time = exports.sleep = void 0;
var sleep = function (ms) {
    if (ms === void 0) { ms = 2000; }
    return (new Promise(function (r) { return setTimeout(r, ms); }));
};
exports.sleep = sleep;
exports.Time = {
    parseTime: function (x) { return x >= 10 ? "".concat(x) : "0".concat(x); },
    secondsToTime: function (x) {
        var m = Math.floor(x / 60);
        var s = x - (m * 60);
        return { m: exports.Time.parseTime(m), s: exports.Time.parseTime(s) };
    },
    timeToSeconds: function (input) {
        var _a, _b;
        var r = (((_a = Number(input.m)) !== null && _a !== void 0 ? _a : 0) * 60) + ((_b = Number(input.s)) !== null && _b !== void 0 ? _b : 0);
        return r;
    }
};
