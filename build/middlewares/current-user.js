"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
var jwt_1 = require("../services/jwt");
var currentUser = function (req, res, next) {
    var _a;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt)) {
        return next();
    }
    try {
        var payload = jwt_1.jwtService.verifyUser(req.session.jwt);
        req.currentUser = payload;
    }
    catch (err) { }
    next();
};
exports.currentUser = currentUser;
