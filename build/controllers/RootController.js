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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootController = void 0;
var decorators_1 = require("../decorators");
var middlewares_1 = require("../middlewares");
var RootController = /** @class */ (function () {
    function RootController() {
    }
    RootController.prototype.getRoot = function (req, res) {
        if (req.session && req.session.loggedIn) {
            res.send("\n        <div> \n          <div> You are logged in </div>\n          <a href=\"/logout\">Logout</a>\n        </div>\n      ");
        }
        else {
            res.send("\n        <div> \n          <div> You are not logged in </div>\n          <a href=\"/auth/login\">Login</a>\n        </div>\n      ");
        }
    };
    RootController.prototype.postLogout = function (req, res) {
        req.session = null;
        res.redirect('/');
    };
    RootController.prototype.getProtected = function (req, res) {
        res.send('Welcome to protected route');
    };
    __decorate([
        decorators_1.get('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], RootController.prototype, "getRoot", null);
    __decorate([
        decorators_1.get('/logout'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], RootController.prototype, "postLogout", null);
    __decorate([
        decorators_1.get('/protected'),
        decorators_1.use(middlewares_1.Auth.requireAuth),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], RootController.prototype, "getProtected", null);
    RootController = __decorate([
        decorators_1.controller('')
    ], RootController);
    return RootController;
}());
exports.RootController = RootController;
