"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_1 = require("../app");
(0, vitest_1.describe)('Markdown suite', () => {
    (0, vitest_1.it)('should convert markdown to html', async () => {
        const html = await app_1.MdLib.mdToHtml(process.env.SAMPLE_MD);
        (0, vitest_1.expect)(html).toBeTruthy();
    });
    (0, vitest_1.it)('should convert html to markdown', async () => {
        const md = await app_1.MdLib.htmlToMd(process.env.SAMPLE_HTML);
        (0, vitest_1.expect)(md).toBeTruthy();
    });
});
