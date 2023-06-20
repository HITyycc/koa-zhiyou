"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmsCode = void 0;
const codeGenerator_1 = require("@src/lib/codeGenerator");
const getSmsCode = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const code = (0, codeGenerator_1.codeGenerator)(6);
    console.log(code);
});
exports.getSmsCode = getSmsCode;
//# sourceMappingURL=getSmsCode.js.map