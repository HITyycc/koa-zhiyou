"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const koa_router_1 = __importDefault(require("koa-router"));
const routers = new koa_router_1.default();
routers.use(user_1.default.routes());
exports.default = routers;
//# sourceMappingURL=index.js.map