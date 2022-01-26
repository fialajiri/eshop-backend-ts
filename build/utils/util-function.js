"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayDifference = void 0;
var arrayDifference = function (first, seconnd) {
    var result = [];
    for (var _i = 0, first_1 = first; _i < first_1.length; _i++) {
        var p = first_1[_i];
        if (seconnd.indexOf(p) === -1) {
            result.push(p);
        }
    }
    return result;
};
exports.arrayDifference = arrayDifference;
