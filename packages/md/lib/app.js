import { NodeHtmlMarkdown } from "node-html-markdown";
import { marked } from "marked";
import DOMPurify from "dompurify";
export const MdLib = {
    async htmlToMd(html) {
        let x = NodeHtmlMarkdown.translate(html);
        return x;
    },
    async mdToHtml(md) {
        const { JSDOM } = await import('jsdom');
        const { window } = new JSDOM('');
        let dom = DOMPurify(window);
        let x = marked(md, { "headerIds": false });
        x = dom.sanitize(x);
        return x;
    }
};
export const ClientMdLib = {
    async htmlToMd(html) {
        let x = NodeHtmlMarkdown.translate(html);
        return x;
    },
    async mdToHtml(md) {
        let dom = DOMPurify(window);
        let x = marked(md, { "headerIds": false });
        x = dom.sanitize(x);
        return x;
    }
};
