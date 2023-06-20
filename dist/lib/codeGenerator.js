"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeGenerator = void 0;
const codeGenerator = (digit) => {
    let randomNum = Math.random();
    while (randomNum == 0) {
        randomNum = Math.random();
    }
    let code = randomNum.toString().split(".")[1].slice(-digit);
    code = code.padStart(digit - code.length, '0');
    return code;
};
exports.codeGenerator = codeGenerator;
//# sourceMappingURL=codeGenerator.js.map