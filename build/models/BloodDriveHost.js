"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodDriveHost = void 0;
var mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
var BloodDriveHost = /** @class */ (function () {
    function BloodDriveHost() {
        var schema = new mongoose_1.Schema({
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            organizationType: { type: String, enum: ["Business", "Religious", "Civic/Community", "Government", "Education", "Healthcare", "Other"], default: "Other" },
            organization: { type: String, required: true },
            phoneType: { type: String, enum: ["work", "home", "mobile"], default: "mobile" },
            phone: { type: String, required: true },
            venue: { type: String, required: true },
            date: { type: Date, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
            incentive: { type: String, default: "None" },
            additionalComment: { type: String, required: true },
            lat: { type: String, required: false, default: "100.0" },
            lng: { type: String, required: false, default: "100.0" },
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
        }, {
            toJSON: {
                transform: function (doc, ret) {
                    ret.id = ret._id;
                    delete ret.__v;
                    delete ret._id;
                },
            },
            timestamps: true,
        });
        this._model = mongoose_1.model('BloodDriveHost', schema);
    }
    Object.defineProperty(BloodDriveHost.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: false,
        configurable: true
    });
    return BloodDriveHost;
}());
exports.BloodDriveHost = BloodDriveHost;
