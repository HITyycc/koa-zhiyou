"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const user_1 = __importDefault(require("@src/controller/user"));
const routers = new koa_router_1.default();
routers.prefix("/user");
routers.get('/login', user_1.default.login);
//routers.get('/getsmscode', userController.getSmsCode)
exports.default = routers;
//# sourceMappingURL=user.js.map