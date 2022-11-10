import { NodeHtmlMarkdown } from "node-html-markdown";
import { JSDOM } from "jsdom";
import { marked } from "marked";
import DOMPurify from "dompurify";

export namespace MdLib {
   export async function htmlToMd(html: string) {
      let x: string = NodeHtmlMarkdown.translate(html)
      return x
   }


   export async function mdToHtml(md: string) {
      const { window } = new JSDOM('')
      let dom = DOMPurify(window as unknown as Window)
      let x: string = marked(md, { "headerIds": false })
      x = dom.sanitize(x)
      return x
   }

} 