import { describe, it, expect } from "vitest";
import { MdLib } from "../app";
describe('Markdown suite', () => {
    it('should convert markdown to html', async () => {
        const html = await MdLib.mdToHtml(process.env.SAMPLE_MD);
        expect(html).toBeTruthy();
    });
    it('should convert html to markdown', async () => {
        const md = await MdLib.htmlToMd(process.env.SAMPLE_HTML);
        expect(md).toBeTruthy();
    });
});
