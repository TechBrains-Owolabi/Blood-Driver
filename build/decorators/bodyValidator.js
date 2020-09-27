"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyValidator = void 0;
require("reflect-metadata");
var MetadataKeys_1 = require("../enums/MetadataKeys");
function bodyValidator(validators) {
    return function (target, key, desc) {
        Reflect.defineMetadata(MetadataKeys_1.MetadataKeys.validators, validators, target, key);
    };
}
exports.bodyValidator = bodyValidator;
