"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var custom_errors_1 = require("../errors/custom-errors");
var errorHandler = function (err, req, res, next) {
    if (err instanceof custom_errors_1.CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeError() });
    }
    console.log(err);
    res.status(400).send({ errors: [{ message: "Něco se pokazilo" }] });
};
exports.errorHandler = errorHandler;
