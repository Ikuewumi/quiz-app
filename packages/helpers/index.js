"use strict";
exports.__esModule = true;
exports.arrFunc = exports.arrStr = exports.arr = exports.num = exports.str = exports.sleep = void 0;
var sleep = function (ms) {
    if (ms === void 0) { ms = 2000; }
    return (new Promise(function (r) { return setTimeout(r, ms); }));
};
exports.sleep = sleep;
var str = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.reduce(function (acc, arg) {
        return acc && (typeof arg === 'string');
    }, true);
};
exports.str = str;
var num = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.reduce(function (acc, arg) {
        return acc && (typeof arg === 'number');
    }, true);
};
exports.num = num;
var arr = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.reduce(function (acc, arg) {
        return acc && (Array.isArray(arg));
    }, true);
};
exports.arr = arr;
var arrStr = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.reduce(function (acc, arg) {
        return acc && (arg.reduce(exports.str));
    }, true);
};
exports.arrStr = arrStr;
var arrFunc = function (func) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return args.reduce(function (acc, arg) {
        return acc && (arg.reduce(func));
    }, true);
};
exports.arrFunc = arrFunc;
