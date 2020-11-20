"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodDriveHostController = void 0;
var express_validator_1 = require("express-validator");
var AppDatabase_1 = require("../AppDatabase");
var decorators_1 = require("../decorators");
var enums_1 = require("../enums");
var errors_1 = require("../errors");
var middlewares_1 = require("../middlewares");
var BloodDriveHostController = /** @class */ (function () {
    function BloodDriveHostController() {
    }
    BloodDriveHostController.prototype.createBloodDriveHost = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, organization, organizationType, firstName, lastName, phone, phoneType, venue, date, city, state, country, lat, lng, incentive, additionalComment, currentDate, bloodDriveHost;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, organization = _a.organization, organizationType = _a.organizationType, firstName = _a.firstName, lastName = _a.lastName, phone = _a.phone, phoneType = _a.phoneType, venue = _a.venue, date = _a.date, city = _a.city, state = _a.state, country = _a.country, lat = _a.lat, lng = _a.lng, incentive = _a.incentive, additionalComment = _a.additionalComment;
                        currentDate = new Date().toDateString;
                        if (date <= currentDate) {
                            throw new errors_1.BadRequestError("Date can not be less than todays date");
                        }
                        return [4 /*yield*/, AppDatabase_1.DB.Models.BloodDriveHost.create({ email: email, organization: organization, organizationType: organizationType, firstName: firstName, lastName: lastName, venue: venue, date: date, phone: phone, phoneType: phoneType, city: city, state: state, country: country, lat: lat, lng: lng, incentive: incentive, additionalComment: additionalComment })];
                    case 1:
                        bloodDriveHost = _b.sent();
                        res.status(enums_1.HttpStatusCodes.CREATED).json(bloodDriveHost);
                        return [2 /*return*/];
                }
            });
        });
    };
    BloodDriveHostController.prototype.getAllBloodDrive = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var allBloodDrive;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AppDatabase_1.DB.Models.BloodDriveHost.find()];
                    case 1:
                        allBloodDrive = _a.sent();
                        res.status(200).json(allBloodDrive);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        decorators_1.post("/"),
        decorators_1.bodyValidator([
            express_validator_1.body('email').isEmail().withMessage('Email must be vaild'),
            express_validator_1.body('firstName').trim(),
            express_validator_1.body('lastName').trim(),
            express_validator_1.body('phone').trim().isLength({ min: 11, max: 11 }).withMessage("Pnone number must be 11 characters"),
            express_validator_1.body('city').trim(),
            express_validator_1.body('state').trim(),
            express_validator_1.body('country').trim(),
            express_validator_1.body('incentive').trim(),
            express_validator_1.body('additionalComment').trim(),
        ]),
        decorators_1.use(middlewares_1.validateRequest),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], BloodDriveHostController.prototype, "createBloodDriveHost", null);
    __decorate([
        decorators_1.get('/'),
        decorators_1.use(middlewares_1.validateRequest),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], BloodDriveHostController.prototype, "getAllBloodDrive", null);
    BloodDriveHostController = __decorate([
        decorators_1.controller('/drivehost')
    ], BloodDriveHostController);
    return BloodDriveHostController;
}());
exports.BloodDriveHostController = BloodDriveHostController;
