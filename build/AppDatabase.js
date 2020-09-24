"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
var mongoose_1 = require("mongoose");
var models_1 = require("./models");
var errors_1 = require("./errors");
var DB = /** @class */ (function () {
    function DB() {
        // this is where we make all neccessary connections
        mongoose_1.connect('mongodb://localhost:27017/boilerplate', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this._db = mongoose_1.connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);
        // this is where we initialize all models
        this._models = {
            User: new models_1.User().model,
        };
    }
    Object.defineProperty(DB, "Models", {
        get: function () {
            if (!DB.instance) {
                DB.instance = new DB();
            }
            return DB.instance._models;
        },
        enumerable: false,
        configurable: true
    });
    DB.prototype.connected = function () {
        console.log('Mongoose has connected');
    };
    DB.prototype.error = function (error) {
        throw new errors_1.DatabaseConnectionError(error.message);
    };
    return DB;
}());
exports.DB = DB;
