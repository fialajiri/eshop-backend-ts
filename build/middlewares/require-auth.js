"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
var not_authorized_erros_1 = require("../errors/not-authorized-erros");
var requireAuth = function (req, res, next) {
    if (!req.currentUser) {
        throw new not_authorized_erros_1.NotAuthorizedError();
    }
    next();
};
exports.requireAuth = requireAuth;
