"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
var not_authorized_erros_1 = require("../errors/not-authorized-erros");
var requireAdmin = function (req, res, next) {
    var _a;
    if (!((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        throw new not_authorized_erros_1.NotAuthorizedError();
    }
    next();
};
exports.requireAdmin = requireAdmin;
