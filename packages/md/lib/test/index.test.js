"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('hello', () => {
    (0, vitest_1.it)('should work', () => {
        (0, vitest_1.expect)(Math.sqrt(4)).toBe(2);
    });
});
