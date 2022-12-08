import { NodeHtmlMarkdown } from "node-html-markdown";
import { marked } from "marked";
import DOMPurify from "dompurify";

export const MdLib = {
   async htmlToMd(html: string) {
      let x: string = NodeHtmlMarkdown.translate(html)
      return x
   },


   async mdToHtml(md: string) {
      const { JSDOM } = await import('jsdom')
      const { window } = new JSDOM('')
      let dom = DOMPurify(window as unknown as Window)
      let x: string = marked(md, { "headerIds": false })
      x = dom.sanitize(x)
      return x
   }

}

export const ClientMdLib = {
   async htmlToMd(html: string) {
      let x: string = NodeHtmlMarkdown.translate(html)
      return x
   },


   async mdToHtml(md: string) {
      let dom = DOMPurify(window)
      let x: string = marked(md, { "headerIds": false })
      x = dom.sanitize(x)
      return x
   }
}