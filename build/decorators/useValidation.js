"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidations = void 0;
require("reflect-metadata");
var MetadataKeys_1 = require("../enums/MetadataKeys");
function useValidations(middlewares) {
    return function (target, key, desc) {
        Reflect.defineMetadata(MetadataKeys_1.MetadataKeys.middlewares, middlewares, target, key);
    };
}
exports.useValidations = useValidations;
