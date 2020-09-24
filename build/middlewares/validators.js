"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
var enums_1 = require("../enums");
var errors_1 = require("../errors");
var Validators = /** @class */ (function () {
    function Validators() {
    }
    Validators.requiredFields = function (keys) {
        return function (req, res, next) {
            if (!req.body) {
                res.status(enums_1.HttpStatusCodes.UNPROCESSED).send('Invalid request');
                return;
            }
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (!req.body[key]) {
                    throw new errors_1.BadRequestError("Missing field " + key);
                }
            }
            next();
        };
    };
    return Validators;
}());
exports.Validators = Validators;
