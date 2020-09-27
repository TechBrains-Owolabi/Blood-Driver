"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
var enums_1 = require("../enums");
var custom_errors_1 = require("../errors/custom-errors");
exports.globalErrorHandler = function (err, req, res, next) {
    if (err instanceof custom_errors_1.CustomError) {
        return res.status(err.statusCode).json({ errors: err.serializeErrors() });
    }
    res.status(enums_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
        errors: [{ message: 'Something went wrong' }],
    });
};
