"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MdLib = void 0;
const node_html_markdown_1 = require("node-html-markdown");
const jsdom_1 = require("jsdom");
const marked_1 = require("marked");
const dompurify_1 = __importDefault(require("dompurify"));
var MdLib;
(function (MdLib) {
    async function htmlToMd(html) {
        let x = node_html_markdown_1.NodeHtmlMarkdown.translate(html);
        return x;
    }
    MdLib.htmlToMd = htmlToMd;
    async function mdToHtml(md) {
        const { window } = new jsdom_1.JSDOM('');
        let dom = (0, dompurify_1.default)(window);
        let x = (0, marked_1.marked)(md, { "headerIds": false });
        x = dom.sanitize(x);
        return x;
    }
    MdLib.mdToHtml = mdToHtml;
})(MdLib = exports.MdLib || (exports.MdLib = {}));
