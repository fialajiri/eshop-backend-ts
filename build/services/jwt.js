"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var jwtService = /** @class */ (function () {
    function jwtService() {
    }
    jwtService.getToken = function (payload) {
        var expiresIn = eval(process.env.JWT_EXPIRY);
        var secret = process.env.JWT_SECRET;
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expiresIn });
    };
    jwtService.getRefreshToken = function (payload) {
        var expiresIn = eval(process.env.REFRESH_TOKEN_EXPIRY);
        var secret = process.env.REFRESH_TOKEN_SECRET;
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expiresIn });
    };
    jwtService.verifyUser = function (jwtToken) {
        var secret = process.env.JWT_SECRET;
        return jsonwebtoken_1.default.verify(jwtToken, secret);
    };
    return jwtService;
}());
exports.jwtService = jwtService;
