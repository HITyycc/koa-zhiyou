"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const env = (_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim();
if (env == 'production') {
    require('module-alias/register');
}
const koa_1 = __importDefault(require("koa"));
const routes_1 = __importDefault(require("./routes"));
console.log(process.env.NODE_ENV);
const app = new koa_1.default();
app.use(routes_1.default.routes());
app.listen(3000);
//# sourceMappingURL=index.js.map