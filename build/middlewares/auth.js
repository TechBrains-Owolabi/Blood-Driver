"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
var Auth = /** @class */ (function () {
    function Auth() {
    }
    Auth.requireAuth = function (req, res, next) {
        if (req.session && req.session.loggedIn) {
            next();
            return;
        }
        res.status(403);
        res.send('Not permitted!!!');
    };
    return Auth;
}());
exports.Auth = Auth;
